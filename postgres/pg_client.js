/*
	Client for talking with the postgres database

*/

var pg = require('pg');
var _ = require('underscore');


function PGClient(){
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
	
	var args = [];
	if ( _.isString( query ) )
		args.push( query );
	
	else if ( _.isObject( query ) ){
		if ( query.text )
			args.push( query.text );

		if ( query.values )
			args.push( query.values);
	}

	args.push(function( err, result ){
		if( err && this.transactionErrorHandler )
			this.transactionErrorHandler( err );
		if ( callback ) 
			callback( result , err );
	});
	
	this.client.query.apply( this.client, args );
};

PGClient.prototype.performQueries = function ( queries, callback ){
	
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
			i++;

			next();

		});
	};

	next();
};


/*
Transactions handler
*/

PGClient.prototype.transaction = function( handler ){
	if ( handler && _.isFunction( handler ) )
		this.transactionErrorHandler = handler;
	this.performQuery( "BEGIN" );
};

PGClient.prototype.rollback = function(){
	this.performQuery( "ROLLBACK" );
};

PGClient.prototype.commit = function( callback ){
	this.performQuery( "COMMIT" ,function( result, error ){
		this.transactionErrorHandler = false;
		if ( callback )
			callback( result, error );
	});
};

module.exports = PGClient;