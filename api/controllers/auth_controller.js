// ===========================================================================================================
// AuthController - Handling Client Auths
// ===========================================================================================================


var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Collections = 	require(COMMON + 'collections/collections.js');
var Parse = 		require('parse').Parse;
var util =			require(COMMON + 'utilities/util.js');
var ContextIO =		require(COMMON + 'connectors/contextio_connector.js');
var SlackConnector =require(COMMON + 'connectors/slack_connector.js');
var Q = require("q");


// ===========================================================================================================
// Instantiation
// ===========================================================================================================

function AuthController( userId, client, logger ){
	this.userId = userId;
	this.logger = logger;
	this.client = client;
};


// ===========================================================================================================
// Main auth function - called from the request and handles the auth process
// ===========================================================================================================

AuthController.prototype.auth = function ( req, callback ){
	var self = this;
	var body = req.body;

};

AuthController.prototype.verifySlackToken = function ( req, callback ){
	var self = this;
	var body = req.body;
	var slackConnector = new SlackConnector();
	slackConnector.requestToken(body.code, function(res, error){
		if(res){
			if(res.ok){
				slackConnector.setToken(res.access_token);
				slackConnector.request("auth.test", {}, function(res, error){
					if(res){
						if(res.ok){
							var query = sql.invite.select( sql.invite.star() )
								.where( sql.invite.teamId.equals(res.team_id).and( sql.invite.inviteeSlackId.equals(res.user_id) ) ).toQuery();
							self.client.performQuery(query, function(res, result){
								if(res){
									var returnRes = {access_token: slackConnector.token, ok:true};
									if(res.rows.length){

										returnRes.fromInvite = true;
										var lowestInvitation = new Date().getTime();
										for( var i in res.rows){
											row = res.rows[i];
											if(row.createdAt && row.createdAt.getTime() < lowestInvitation){
												lowestInvitation = row.createdAt.getTime()
											}
										}
										var nowUnix = new Date().getTime()/1000;
										var inviteUnix = lowestInvitation/1000;
										var secondsSinceInvite = nowUnix - inviteUnix;
										var hoursSinceInvite = Math.floor(secondsSinceInvite / 60 / 60);
										returnRes.hoursSinceInvite = hoursSinceInvite;
									}
									callback(returnRes);
								}
								else{ 
									callback(false, error);
								}
							});
						}
						else callback(false, res);
					}
					else callback(false, error);
				});
			}
			else callback(false, res);
		}
		else callback(false ,error);

		
	});
};

AuthController.prototype.addMailbox = function ( req, callback ){
	// Add code to fetch context IO user ID
	var body = req.body;
	
	var contextIO = new ContextIO();
	contextIO.addMailbox(body.callback_url, false, function(res, error){
		callback(res, error);
	});
	
};



module.exports = AuthController;