var _ = require('underscore');
var sql = require('../postgres/pg_sql.js');
var PGClient = require('../postgres/pg_client.js');
var Logger = require( '../utilities/logger.js' );
var CaseUpdateQuery = require('./case_update_query.js');

function LoadTests(){
	this.logger = new Logger();
	this.client = new PGClient();
	this.targetNumber = 10000;
	this.batchSize = 200;
	this.numberOfBatches = parseInt( this.targetNumber / this.batchSize , 10 );
};

LoadTests.prototype.populateDatabaseWithObjects = function( callback ){
	var queries = [];
	this.logger.time('starting handling');
	for ( var i = 0 ; i < this.numberOfBatches ; i++ ){
		var query = sql.todo;
		var userId = this.makeid(10);
		for( var taskNumber = 0 ; taskNumber < this.batchSize ; taskNumber++ ){
			var taskLocalId = this.makeid(10);
			var dummyData = this.dummyData(taskNumber);
			dummyData.localId = taskLocalId;
			dummyData.userId = userId;
			dummyData.updatedAt = this.randomDate( new Date( 2012, 0, 1 ), new Date() ).toISOString();
			query = query.insert(dummyData);
		}
		queries.push( query.toNamedQuery("INSERTTODO") );
	}
	var self = this;
	this.logger.time('prepared objects');
	this.client.connect( function( connected ){
		if ( !connected )
			return callback(false,self.logger.logs);
		self.logger.time('populating ' + self.batchSize * self.numberOfBatches + " in " + self.numberOfBatches + " of " + self.batchSize + " batches");
		self.client.performQueries( queries , function( result, error){
			self.logger.time("finalized", true);
			self.client.end();
			callback(result,error);
		}, function( result, counter ){
			var time = self.logger.getTime();
			var insertSpeed = parseInt( self.batchSize / time * 1000 , 10 );
			self.logger.time( "" + ( counter + 1 ) + " - " + insertSpeed + " rec/s - " + self.batchSize );
		});
	});
};

LoadTests.prototype.loadTestUpdates = function( callback ){
	var todo = sql.todo;
	var self = this;


	this.client.connect( function( connected, err ){
		if ( !connected )
			return callback( false, err );
		
		self.logger.time( 'connected' );
		var counterQuery = todo.select( todo.id.count() ).toQuery();
		
		self.client.performQuery( counterQuery , function( result, error ){
			var maxIdNumber = parseInt( result.rows[ 0 ].id_count , 10 );
			var queries = [ ];
			self.logger.time('starting handling');

			
			for ( var i = 0 ; i < self.numberOfBatches ; i++ ){
				var updateQuery = new CaseUpdateQuery( "todo", "id" );
				for ( var taskNumber = 0 ; taskNumber < self.batchSize ; taskNumber++){
				//var identifier = (i == 0) ? 29674 : 29750;

					var identifier = Math.floor( ( Math.random() * maxIdNumber ) );
					var updates = { "order": 1337, "title": "ztest2" };
					updateQuery.addObjectUpdate( updates, identifier );
				
				}
				var query = updateQuery.toQuery();
				queries.push(query);

			}
			//return;
			
			self.client.performQueries( queries , function( result, error){
				
				self.logger.time( "finalized", true );
				self.client.end();
				callback( result , error );

			}, function( result, counter ){
				var time = self.logger.getTime();
				var insertSpeed = parseInt( self.batchSize / time * 1000 , 10 );
				self.logger.time( "" + ( counter + 1 ) + " - " + insertSpeed + " rec/s - " + self.batchSize );

			});
			
		});
	});
};



LoadTests.prototype.updateObject = function( maxIdNumber ){
	var identifier = Math.floor( ( Math.random() * maxIdNumber ) );

}


LoadTests.prototype.getStats = function( callback ){
	var todo = sql.todo;
	var self = this;

	this.client.connect( function( connected, err ){
		if ( !connected )
			return callback( false, err );
		self.logger.time( 'connected' );
		var counterQuery = todo.select( todo.id.count() ).toQuery();
		var query = counterQuery;
		query = "select * from pg_settings where name='max_connections'";
		self.client.performQuery( query , function( result, error){
			
			self.logger.time( "finalized" , true );
			self.client.end();

			callback( { tasks: result.rows[ 0 ].id_count , users: result.rows[ 0 ].userId_count } , error );
		
		});
	});
};






LoadTests.prototype.makeid = function( length )
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt( Math.floor( Math.random() * possible.length ) );

    return text;
};

LoadTests.prototype.dummyData = function( order ){
	var randomThree = Math.floor((Math.random() * 3) + 1);
	var completed = false;
	var randomDate;
	switch( randomThree ){
		case 1:
		completed = true;
		case 2:
		randomDate = this.randomDate( new Date( 2012, 0, 1 ), new Date() ).toISOString();
		break;
		case 3:
		break;
	}
	var priority =  Math.floor((Math.random() * 2));

	var completionDate = completed ? randomDate : null;
	var schedule = completed ? null : randomDate;
	var todoData = {
		title: "This is a dummy title",
		order: order,
		notes: "random notes",
		priority: priority,
		completionDate: completionDate,
		schedule: schedule
	};


	return todoData;
};
LoadTests.prototype.randomDate = function( start, end ) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

module.exports = LoadTests;