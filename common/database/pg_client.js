/*
	Client for talking with the postgres database

*/
var COMMON = 			'../';
var sql 	= require('sql'),
	Parse 	= require( 'parse' ).Parse,
	defs 	= require('./sql_definitions.js'),
	SlackConnector = require(COMMON + 'connectors/slack_connector.js');
var pg = require('pg');
pg.defaults.poolSize = 80;
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
		this.timebomb = setTimeout(function(){
			console.log(new Date() + ": Timebomb exploded");
			if(self){
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
	pg.connect( this.conString, function( err, client, done ) {
		if ( !err ){
			var pool = pg.pools.getOrCreate(self.conString);

			if(pool.getPoolSize() > 75){
				console.log(new Date() + ": Exited from full pool");
				process.exit(1);
				return callback( false , "Drained pool" );
			}
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
	clearTimeout(this.timebomb);
	function finalize(){
		if ( self.done ){
			self.done();
			self.done = false;
		}
		self.client = false;
		self.connected = false;
	}
	finalize();
	
};

PGClient.prototype.performQuery = function ( query , callback ){
	var self = this;
	if ( !this.connected ){
		return this.connect( function( connected , error ){
			if ( error )
				return callback ? callback( false, error, query ) : false;
			self.performQuery ( query, callback );
		});
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
		if(self.timedout){
			err = {code:510, message:"Request Timed Out"};
			result = false;
		}
		
		// If in a transaction, roll back first
		if( err && self.runningTransaction ){
			self.rollback(function(){
				callback( result , err, query );
			});
		}
		else if ( callback )
			callback( result , err, query );


		var endTime = new Date().getTime();
		var resultTime = (endTime - startTime);
		if(resultTime > 3500){
			console.log(new Date() + ": " + resultTime, query.text, query.values );
		}
	});
	this.client.query.apply( this.client, args );
	
};

PGClient.prototype.performQueries = function ( queries, callback, iterator ){

	var self = this;
	if ( !this.connected ){
		return this.connect( function( connected , error ){
			if ( error )
				return callback ? callback( false, error, query ) : false;
			self.performQueries ( queries, callback, iterator );
		});
	}

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
	this.slackConnector.request("users.info", {user: userId}, function(data, error){
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
			if(!dataObj.profileImageURL)
				dataObj.profileImageURL = data.user.profile.image_192;
			var query = defs.user.select(defs.user.slackId).from(defs.user).where( defs.user.teamId.equals(teamId).and(defs.user.slackId.equals(userId))).toQuery()
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
	this.slackConnector.request("team.info", {}, function(data,error){
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

PGClient.prototype.validateToken = function( token , callback){
	var self = this;
	if ( !token )
		return callback(false, { code : 142 , message : "sessionToken must be included" });
	function validateFromSlack(){
		self.slackConnector = new SlackConnector(token);

		self.slackConnector.request("auth.test", {}, function(data, error){
			if(data){
				if(data.ok){
					self.fetchSlackInfo(token, data.user_id, data.team_id);
					self.userId = data.user_id;
					callback( data.user_id, data.team_id );
					self.storeSession( token , data.user_id, data.team_id );
					
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

PGClient.prototype.rollback = function(callback){
	var self = this;
	this.performQuery( "ROLLBACK" ,function( result, error ){
		self.runningTransaction = false;
		if ( callback )
			callback( result, error );
	});
	
};

PGClient.prototype.commit = function( callback ){
	var self = this;
	this.performQuery( "COMMIT" ,function( result, error ){
		self.runningTransaction = false;
		if ( callback )
			callback( result, error );
	});

};

module.exports = PGClient;