// ===========================================================================================================
// InviteController - Handling Invitation requests
// ===========================================================================================================


var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var util =			require(COMMON + 'utilities/util.js');
var SlackConnector =require(COMMON + 'connectors/slack_connector.js');
var Q = require("q");


// ===========================================================================================================
// Instantiation
// ===========================================================================================================

function InviteController( userId, teamId, client, logger ){
	this.userId = userId;
	this.logger = logger;
	this.teamId = teamId;
	this.client = client;
	this.slackConnector = new SlackConnector();
};

InviteController.prototype.getInvitedUsers = function( req, callback ){
	console.log( req.query );
	var team = req.query.team;
	var inviter = req.query.inviter;
	var invitee = req.query.invitee;
	if(!team || !inviter || !invitee)
		return callback(false, "Not enough information");

	var query = sql.user.select( sql.user.slackId, sql.user.profileImageURL, sql.user.username, sql.user.first_name ).where(
		sql.user.teamId.equals(team).and( sql.user.slackId.in([inviter, invitee]))
	).toQuery();
	this.client.performQuery(query, function(res, error){
		if(res){
			var returnObject = {};
			for(var i in res.rows){
				var row = res.rows[i];
				if(row.slackId == inviter)
					returnObject.inviter = row;
				/*if(row.slackId == invitee)
					returnObject.invitee = row;*/
			}
			if(returnObject.inviter){
				returnObject.ok = true;
				callback(returnObject);
			}
			else{
				callback(false, "Users not found");
			}
		}
		else{
			callback(false, error);
		}
	})
}


// Send invitation to user
// ===========================================================================================================
InviteController.prototype.inviteUser = function ( req, callback ){
	var self = this;
	var body = req.body;
	this.slackConnector.setToken(body.sessionToken);
	var invite = body.invite;
	if(!invite || !_.isObject(invite))
		return callback(false, "Invite not set - must be object");
	if(!invite.slackUserId || !invite.type)
		return callback(false, "Both slackUserId & type must be set on invite");
	this.type = invite.type;
	// Run the promise loop for syncing - load, find existing, save, get updates!
	this.fetchSwipesUsers(invite.slackUserId)
	.then( function(){ return self.fetchSlackUser(invite.slackUserId) })
	.then( function(user){ 	self.targetUser = user; return self.fetchCurrentInvitations(); })
	.then( function(rows){ 	return self.determineIfInvitationShouldBeSent(rows); })
	.then( function(){	return self.fetchTargetChannel(); })
	.then( function(channelId){ return self.sendInvitation(channelId); })
	.then( function(){ return self.saveInvite(); })
	.then(function(returnObject){
		callback(returnObject);
	})
	.fail(function(error){
		console.log(error);
		callback(false, error);
	})
	.catch(function(error){
		console.log(error);
		callback(false, error);
	});
};



InviteController.prototype.fetchSwipesUsers = function( slackUserId ) {
	var deferred = Q.defer();
	var self = this;
	var query = sql.user.select( sql.user.star() ).where( sql.user.teamId.equals(this.teamId).and( sql.user.slackId.in( [ this.userId, slackUserId ] )) ).toQuery();
	this.client.performQuery(query, function(res, error){
		if(res && res.rows){
			for( var i in res.rows){
				var user = res.rows[i];
				if(user.slackId == self.userId)
					self.user = user;
				if(user.slackId == slackUserId)
					return deferred.reject("User already using Swipes");
			}
			deferred.resolve();
		}
		else deferred.reject(error);
	});
	return deferred.promise;
}
InviteController.prototype.fetchSlackUser = function( slackUserId ){
	var deferred = Q.defer();
	var self = this;
	this.slackConnector.request("users.info", { "user": slackUserId }, function(res, error){
		if(res){
			if(res.ok){
				deferred.resolve(res.user);
			}
			else{
				deferred.reject(res);
			}
		}
		else
			deferred.reject(error)
	});
	return deferred.promise;
};

InviteController.prototype.fetchCurrentInvitations = function( ){
	var deferred = Q.defer();
	var self = this;
	var query = sql.invite.select( sql.invite.star() ).where( sql.invite.teamId.equals(this.teamId).and( sql.invite.inviteeSlackId.equals( this.targetUser.id ).and( sql.invite.inviterSlackId.equals(this.userId) ) )).toQuery()
	this.client.performQuery(query, function(res, error){
		if(res) deferred.resolve(res.rows);
		else deferred.reject(error);
	});
	return deferred.promise;
};
InviteController.prototype.determineIfInvitationShouldBeSent = function(rows){
	var deferred = Q.defer();
	if(!rows || rows.length == 0)
		deferred.resolve();
	else{
		// TODO: Check when the last invitation was sent
		deferred.reject("Invitation has already been sent");
	} 
	return deferred.promise;
};
InviteController.prototype.fetchTargetChannel = function(){
	var deferred = Q.defer();
	var self = this;
	this.slackConnector.request("im.open", {user: self.targetUser.id}, function(res, error){
		if(res){
			if(res.ok){
				deferred.resolve(res.channel.id);
			}
			else{
				deferred.reject(res);
			}
		}
		else
			deferred.reject(error);
	});
	return deferred.promise;
};
InviteController.prototype.sendInvitation = function(channelId){
	var urlLink = "http://swipesapp.com/slack/?src=invitation&team="+this.teamId+"&invitee="+this.targetUser.id+"&inviter="+this.user.slackId;
	
	var text = encodeURIComponent("I want to collaborate and share tasks with you via \"<"+urlLink+"|Swipes>\"");
	var attachment = encodeURIComponent(JSON.stringify([{"fallback": "Sign up for Swipes to collaborate together on your tasks", "title":"Get started with Swipes", "title_link": urlLink, "image_url": "http://team.swipesapp.com/styles/img/onboard-invite.jpg"}]));
	var deferred = Q.defer();
	var self = this;

	this.slackConnector.request("chat.postMessage", {channel: channelId, as_user: 1, text: text, attachments: attachment}, function(res, error){
		if(res){
			if(res.ok) deferred.resolve(res);
			else deferred.reject(res);
		}
		else deferred.reject(error);
	})
	return deferred.promise;
};
InviteController.prototype.saveInvite = function(){
	var nowUnix = new Date().getTime()/1000;
	var signupUnix = this.user.created_at.getTime()/1000;
	var secondsSinceSignup = nowUnix - signupUnix;
	var hoursSinceSignup = Math.floor(secondsSinceSignup / 60 / 60);
	var deferred = Q.defer();
	var self = this;
	var insertData = {
		"teamId": this.teamId,
		"inviteeSlackId": this.targetUser.id,
		"inviterSlackId": this.user.slackId,
		"type": this.type,
		"hoursSinceSignup": hoursSinceSignup
	};
	var query = sql.invite.insert(insertData).toQuery();
	this.client.performQuery(query, function(res, error){
		if(res) deferred.resolve({ok: true, hoursSinceSignup: hoursSinceSignup});
		else deferred.reject(error);
	});
	return deferred.promise;
};
/*
Validate target user is in slack
Check current invitations to that user
If no invitations has been sent in the last 24 hours
- Send invitation to target user

 */


module.exports = InviteController;