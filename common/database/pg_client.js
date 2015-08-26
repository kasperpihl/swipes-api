/*
	Client for talking with the postgres database

*/
var sql 	= require('sql'),
	Parse 	= require( 'parse' ).Parse,
	defs 	= require('./sql_definitions.js'),
	https	= require('https');;
var pg = require('pg');
pg.defaults.poolSize = 296;
pg.defaults.poolIdleTimeout = 12000;
var _ = require('underscore');
var sessionSeconds = 1 * 24 * 60 * 60 * 1000;

function PGClient( logger, timerForDone ){
	
	this.connected = false;
	this.done = false;
	this.timedout = false;
	this.logger = logger;
	this.userId = false;
	this.conString = this.buildConString();
	if ( !this.conString )
		throw Error('define DATABASE_URL as environment var');
	this.transactionErrorHandler = false;
	if( timerForDone ){
		var self = this;
		setTimeout(function(){
			if(self){
				self.end();
				self.timedout = true;
			}
		}, timerForDone);
	}
}


PGClient.prototype.buildConString = function(){
	var conString = process.env.DATABASE_URL;
	if ( !conString && process.env.RDS_HOSTNAME ){
		conString = "postgres://" + 
					process.env.RDS_USERNAME + ":" + 
					process.env.RDS_PASSWORD + "@" + 
					process.env.RDS_HOSTNAME + ":" +
					process.env.RDS_PORT + "/ebdb";
	}
	return conString;
};


PGClient.prototype.connect = function( callback ){
	var self = this;
	var targetConnect = this.client ? this.client : pg;
	targetConnect.connect( this.conString, function( err, client, done ) {
		if ( !err ){
			self.connected = true;
			self.client = client;
			self.done = done;
		}
		if ( callback )
			callback( ( err ? false : true ) , err );
	});
};


PGClient.prototype.end = function(){
	var self = this;
	function finalize(){
		if ( self.done ){
			self.done();
			self.done = false;
		}
		self.client = false;
		self.connected = false;
	}
	if( this.runningTransaction ){
		this.rollback( function(){
			
		});
		finalize();
	}
	else
		finalize();
	
};

PGClient.prototype.performQuery = function ( query , callback ){
	var self = this;
	if( this.timedout )
		return callback ? callback( false, {code:510, message:"Request Timed Out"}, query ) : false;
	if ( !this.connected ){
		this.connect( function( connected , error ){
			if ( error )
				return callback ? callback( false, error, query ) : false;
			self.performQuery ( query, callback );
		});
		
		return;

	}

	var args = [];
	var numberOfObjects = 0;
	if ( _.isString( query ) )
		args.push( query );
	else if ( _.isObject( query ) ){
		if ( query.text )
			args.push( query.text );

		if ( query.values )
			args.push( query.values);

		if ( query.numberOfRows )
			numberOfObjects = query.numberOfRows;
	}

	if ( args.length == 0 )
		return callback (false, "wrong query format", query);

	var command = args[0].substring(0,6);
	var startTime = new Date().getTime();

	args.push(function( err, result ){
		if ( err ){
			self.logger.log( args[0] );
			self.logger.log( args[1] );
			self.logger.log( err );
		}
		var endTime = new Date().getTime();
		var resultTime = (endTime - startTime);
		if(resultTime > 3500){
			// console.log(new Date() + " query delayed with " + resultTime + " ms for user " + self.userId);
			// console.log( query.text );
			// console.log( query.values );
		}
		var rowsPrSecond = parseInt( numberOfObjects / resultTime * 1000 , 10);
		if(self.logger.getTime() > 30){
			//console.log(resultTime);
			//self.logger.log( query.text );
		}
		if ( numberOfObjects || true ){
			if(command == "SELECT" && result)
				numberOfObjects = result.rows.length;
			//self.logger.time( command + " " + numberOfObjects + ' rows ' + rowsPrSecond + "/s (" + resultTime + "ms)");
		}
		if( err && self.transactionErrorHandler )
			self.transactionErrorHandler( err );
		
		if ( callback )
			callback( result , err, query );
	});
	try{
		this.client.query.apply( this.client, args );
	}
	catch( err ){
		callback( null, err, query );
		this.end();
	}
	
};

PGClient.prototype.performQueries = function ( queries, callback, iterator ){
	
	if ( !queries || !_.isArray(queries) || queries.length == 0 )
		return callback( false, "no queries provided" );

	var i = 0, retCounter = 0 , target = queries.length, returnArr = {};	
	var self = this;
	var hasSentCallback = false;
	for( var i = 0 ; i < queries.length ; i++ ){
		var query = queries[ i ];
		self.performQuery( query , function ( result , err, query ){
			
			if ( err ){
				//console.log( err );
				if( !hasSentCallback ){
					hasSentCallback = true;
					return callback ? callback( false, err , retCounter ) : false;
				}
				return false;
				
			}

			if( !query.name )
				query.name = "" + retCounter;

			if( returnArr[ query.name ] )
				returnArr[ query.name ] = returnArr[ query.name ].concat( result.rows );
			else
				returnArr[ query.name ] = result.rows;

			if ( iterator )
				iterator( result, retCounter);
			
			retCounter++;
			
			if ( retCounter == target && !hasSentCallback ){
				if( !self.runningTransaction )
					self.end();
				return callback( returnArr, false );
			}

		});
	}
};

PGClient.prototype.storeSession = function( token , userId, organisationId ){
	var expires = new Date( new Date().getTime() + sessionSeconds );
	insertData = { sessionToken: token, userId: userId, expires: expires };
	if(organisationId)
		insertData.organisationId = organisationId
	var query = defs.session.insert( insertData ).toQuery();
	this.performQuery( query );
};
PGClient.prototype.fetchSlackInfo = function(token, userId, teamId){
	var self = this;
	this.slackRequest("users.info", token, {user: userId}, function(data, error){
		if(data && data.ok){
			var dataObj = { 
				slackId: userId, 
				username: data.user.name, 
				first_name: data.user.profile.first_name, 
				last_name: data.user.profile.last_name,
				email: data.user.profile.email,
				title: data.user.profile.title,
				phone: data.user.profile.phone,
				is_admin: data.user.is_admin,
				is_owner: data.user.is_owner,
				teamId: teamId, 
				real_name: data.user.profile.real_name_normalized,
				slackToken: token,
				profileImageURL: data.user.profile.image_original
			};
			var query = defs.user.select(defs.user.slackId).from(defs.user).where( defs.user.slackId.equals(userId)).toQuery()
			self.performQuery(query, function(res, error){
				if(res && res.rows){
					var insUpQuery;
					if(res.rows.length){
						insUpQuery = defs.user.update(dataObj).where( defs.user.slackId.equals(userId)).toQuery()
					}
					else
						insUpQuery = defs.user.insert(dataObj).toQuery()
					self.performQuery(insUpQuery, function(res,err){
						console.log("performed query, error:", err);
					});
				}

			})
		}
		else console.log(data, error);
	});
	this.slackRequest("team.info", token, {}, function(data,error){
		if(data && data.ok){
			var dataObj = {
				slackId: teamId,
				name: data.team.name,
				domain: data.team.domain,
				email_domain: data.team.email_domain,
				imageURL: data.team.icon.image_original
			};
			var query = defs.team.select(defs.team.slackId).from(defs.team).where( defs.team.slackId.equals(teamId)).toQuery()
			self.performQuery(query, function(res, error){
				if(res && res.rows){
					var insUpQuery;
					if(res.rows.length){
						insUpQuery = defs.team.update(dataObj).where( defs.team.slackId.equals(teamId)).toQuery()
					}
					else
						insUpQuery = defs.team.insert(dataObj).toQuery()
					self.performQuery(insUpQuery, function(res,err){
						console.log("performed query, error:", err);
					});
				}
			})
		}
		else console.log(data, error);
	})
}


PGClient.prototype.slackRequest = function(path, token, params, callback){
	var fullURL = "/api/" + path + "?token="+token;
	for(var key in params){
		fullURL += "&" + key + "=" + params[key];
	}
	var options = {
		method: "POST",
		host: "slack.com",
		path: fullURL,
		headers: { 'Content-Type': 'application/json' }
	};
	try {
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			var output = '';
			res.on('data', function (chunk) {
				output += chunk;
			});
			res.on('end', function() {
	            var jsonObject = JSON.parse(output);
				callback(jsonObject);
	        });
		});
		req.end();
	}
	catch(err) {
		callback(false, err);
	}
}

PGClient.prototype.validateToken = function( token , callback){
	var self = this;
	if ( !token )
		return callback(false, { code : 142 , message : "sessionToken must be included" });
	function validateFromSlack(){
		self.slackRequest("auth.test", token, {}, function(data, error){
			if(data){
				if(data.ok){
					self.fetchSlackInfo(token, data.user_id, data.team_id);
					self.userId = data.user_id;
					callback( data.user_id, data.team_id );
					//self.storeSession( token , data.user_id, data.team_id );
					
				}
				else{
					callback(false, data);
				}
			}
			else
				callback(false, error);
		})
	};

	var now = new Date();
	var query = defs.session.select( defs.session.userId, defs.session.expires, defs.session.organisationId ).where( defs.session.sessionToken.equals( token ).and( defs.session.expires.gt( now ) ) ).toQuery();
	this.performQuery( query, function( result, error ){
		if ( error ){
			console.log("error", error);
			return callback( false, error);
		}
		if ( result.rows && result.rows.length > 0 ){
			self.userId = result.rows[0].userId;
			callback( result.rows[0].userId, result.rows[0].organisationId );
		}
		else{
			console.log("validating from slack"); 
			validateFromSlack();
		}
	});
};

/*
Transactions handler
*/

PGClient.prototype.transaction = function( handler ){
	this.runningTransaction = true;
	if ( handler && _.isFunction( handler ) ){
		this.transactionErrorHandler = handler;
	}
	this.performQuery( "BEGIN" );
};

PGClient.prototype.rollback = function(callback, force){
	var self = this;
	this.performQuery( "ROLLBACK" ,function( result, error ){
		self.runningTransaction = false;
		self.end();
		if ( callback )
			callback( result, error );
	});
	
};

PGClient.prototype.commit = function( callback ){
	var self = this;
	this.performQuery( "COMMIT" ,function( result, error ){
		self.runningTransaction = false;
		self.end();
		if ( callback )
			callback( result, error );
	});

};

module.exports = PGClient;