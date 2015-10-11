/*
	Client for talking with the postgres database

*/
var COMMON = 			'../common/';
var sql 	= require('sql'),
	Queue = require(COMMON + "utilities/queue.js");
var pg = require('pg');
pg.defaults.poolSize = 80;
pg.defaults.poolIdleTimeout = 1000;
var _ = require('underscore');
var sessionSeconds = 1 * 24 * 60 * 60 * 1000;

function PGClient( logger, timerForDone ){
	timerForDone = 10000;
	this.connected = false;
	this.done = false;
	this.timedout = false;
	this.logger = logger;
	this.conString = this.buildConString();
	if ( !this.conString )
		throw Error('define DATABASE_URL as environment var');
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
	clearTimeout(this.timebomb);
	if ( this.done ){
		this.done();
		this.done = false;
	}
	this.client = false;
	this.connected = false;
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
	if ( !queries || !_.isArray(queries) || queries.length == 0 )
		return callback( false, "no queries provided" );

	var returnArr = {};
	var self = this;
	// new queue running 1 query at a time
	var queue = new Queue(1);
	queue.push(queries, true);
	queue.run(function(query, i, next){
		self.performQuery( query , function ( result , err, query ){
			if ( err ){
				return callback ? callback( false, err ) : false;
			}

			if( !query.name )
				query.name = "" + i;

			returnArr[ query.name ] = result.rows;
			next();
		});
	},
	function(){
		return callback( returnArr, false );
	});
};

/*
Transactions handler
*/

PGClient.prototype.transaction = function(){
	this.runningTransaction = true;
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