/*
	Client for talking with the postgres database

*/

var pg = require('pg');
var _ = require('underscore');


function PGClient( logger ){
	this.logger = logger;
	var conString = this.buildConString();
	if ( !conString )
		throw Error('define DATABASE_URL as environment var');
	this.client = new pg.Client( conString );
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
	this.client.connect(function(err) {
		if ( callback )
			callback( ( err ? false : true ) , err );
	});
};
PGClient.prototype.end = function(){
	this.client.end();
}

PGClient.prototype.performQuery = function ( query , callback ){
	
	var self = this;
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

	var command = args[0].substring(0,6);
	var startTime = new Date().getTime();

	args.push(function( err, result ){
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


/*
Transactions handler
*/

PGClient.prototype.transaction = function( batchSize, handler ){
	this.transactionBatchSize = batchSize;
	this.runningTransaction = true;
	if ( handler && _.isFunction( handler ) )
		this.transactionErrorHandler = handler;
	this.performQuery( "BEGIN" );
};

PGClient.prototype.rollback = function(){
	this.performQuery( "ROLLBACK" );
};

PGClient.prototype.commit = function( callback ){
	var self = this;
	this.performQuery( "COMMIT" ,function( result, error ){
		if ( callback )
			callback( result, error );
	});
};

module.exports = PGClient;