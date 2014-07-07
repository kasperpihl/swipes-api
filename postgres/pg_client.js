/*
	Client for talking with the postgres database

*/
var sql 	= require('sql'),
	Parse 	= require( 'parse' ).Parse;
var session = sql.define( { "name": "session" , columns: [ 'sessionToken', 'userId', 'expires'] } );
var pg = require('pg');
pg.defaults.poolSize = 100;
var _ = require('underscore');
var sessionSeconds = 1 * 24 * 60 * 60 * 1000;

function PGClient( logger ){
	
	this.connected = false;
	this.done = false;
	this.logger = logger;
	this.conString = this.buildConString();
	if ( !this.conString )
		throw Error('define DATABASE_URL as environment var');
	this.transactionErrorHandler = false;

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
}

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
	if ( this.done ){
		this.done();
		this.done = false;
	}
	this.client = false;
	this.connected = false;
}

PGClient.prototype.performQuery = function ( query , callback ){
	var self = this;

	if ( !this.connected ){
		this.connect( function( connected , error ){
			if ( error )
				return callback ? callback( false, error ) : false;
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
		return callback (false, "wrong query format");

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
		var rowsPrSecond = parseInt( numberOfObjects / resultTime * 1000 , 10);
		if ( numberOfObjects )
			self.logger.log( command + " " + numberOfObjects + ' rows ' + rowsPrSecond + "/s (" + resultTime + "ms)");
		if( err && self.transactionErrorHandler )
			self.transactionErrorHandler( err );
		
		if ( callback )
			callback( result , err );
	});
	
	this.client.query.apply( this.client, args );
};

PGClient.prototype.performQueries = function ( queries, callback, iterator ){
	
	if ( !queries || !_.isArray(queries) || queries.length == 0 )
		return callback( false, "no queries provided" );

	var i = 0, target = queries.length, returnArr = {};	
	var self = this;
	
	function next(){
		if ( i == target )
			return callback( returnArr, false );

		var query = queries[ i ];
		self.performQuery( query , function ( result , err ){
			if ( err )
				return callback ? callback( false, err , i ) : false;

			if( !query.name )
				query.name = "" + i;
			returnArr[ query.name ] = result.rows;

			if ( iterator )
				iterator( result, i);
			
			i++;
			

			next();

		});
	};

	next();
};

PGClient.prototype.storeSession = function( token , userId ){
	var expires = new Date( new Date().getTime() + sessionSeconds );
	var query = session.insert( { sessionToken: token, userId: userId, expires: expires } ).toQuery();
	this.performQuery( query );
}


PGClient.prototype.validateToken = function( token , store , callback){
	var self = this;
	if ( !token )
		callback(false, { code : 142 , message : "sessionToken must be included" });
	function validateFromParse( store ){
    	Parse.User.become( token ).then( function( user ){
    		callback( user.id, false );
    		if ( store )
    			self.storeSession( token , user.id );

	    },function( error, error2 ){
	    	callback( false, error ); 
	    });
	};
	if ( !store)
		return validateFromParse( store );

	var now = new Date();
	var query = session.select( session.userId, session.expires ).where( session.sessionToken.equals( token ).and( session.expires.gt( now ) ) ).toQuery();
	this.performQuery( query, function( result, error ){
		if ( error )
			return callback( false, error);
		if ( result.rows && result.rows.length > 0 ){
			callback( result.rows[0].userId, false );
		}
		else 
			validateFromParse( true );
	});
}

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

PGClient.prototype.rollback = function(){
	this.performQuery( "ROLLBACK" ,function( result, error ){

	});
};

PGClient.prototype.commit = function( callback ){
	var self = this;
	this.performQuery( "COMMIT" ,function( result, error ){
		if ( callback )
			callback( result, error );
	});
};

module.exports = PGClient;