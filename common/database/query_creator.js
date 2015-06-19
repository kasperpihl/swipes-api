/**

getAllTasksFromServiceThatIsNotCompletedNorDeleted:(String)service ()
getMatchingTasksFromListOfIds:(Array)ids andService:(String)service

What should happen if:

A user deletes a task in Swipes (that is linked to an email)
- Remove Swipes list-label

A user completes a task in Swipes (that is linked to an email)
- Remove Swipes list-label

A user moves an email from the Swipes List (that has a task in Swipes)
- Leave the task, but unlink it

Object to be created:

// Generate a collection to prepare for save
var todoCollection = new Collections.Todo();
todoCollection.loadObjects( arrayOfJsonFormatBelow )
var saveQueries = todoCollection.getInsertAndSaveQueries()
pgClient.performQueries( saveQueries )

json format:
{
	tempId: util.generateId(12)
	order: -1
	schedule: util.convertDate( new Date() )
	title: thread title
	origin: "gmail"
	originIdentifier: "threadId"
	attachments: [
		{
			service: "gmail"
			identifier: "json:{"threadid":"14c15bfa50b6dd93","email":"spwatton@gmail.com”}”
			title: "threadId"
			sync: 1
		}
	]
}



*/
var COMMON = '../';
var _ = require('underscore');
var sql = require('./sql_definitions.js');
var PGClient =        require('./pg_client.js');
var Logger =          require(COMMON + 'utilities/logger.js' );

function QueryCreator( userId ){
	this.userId = userId;
	this.logger = new Logger();
	this.logger.setIdentifier( userId );
	this.client = new PGClient( this.logger, 12000 );
	this.batchSize = 25;
};

QueryCreator.prototype.getAllTasksFromServiceThatIsNotCompletedNorDeleted = function(service, callback){
	var columnsToReturn = [ "origin", "originIdentifier", "localId" ];
	var query = sql.todo.select.apply( sql.todo, sql.getColumnsFromStringArray( sql.todo, columnsToReturn) )
					.from( sql.todo)
					.where( sql.todo.origin.equals( service )
							.and( sql.todo.userId.equals( this.userId ) ))
					.order( sql.todo.originIdentifier )
	.toNamedQuery( "ServiceQuery" );
	this.client.performQueries( [ query ] , function( results, error ){
		if ( error && callback )
			return callback(null, error);
		else if ( callback )
			callback(results);
	});	
	return query;
};

module.exports = QueryCreator;