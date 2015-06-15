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


TESTING: 
var QueryCreator = require('../database/query_creator.js');
app.route('/test').get( function(req,res,next){
  var creator = new QueryCreator( "kzORIThNaw");
  query = creator.getAllTasksFromServiceThatIsNotCompletedNorDeleted("evernote", function(results, error){
    console.log(results);
    console.log(error);
    res.send("result");
  });

});

*/

var _ = require('underscore');
var sql = require('./sql_definitions.js');
var Logger =          require( '../utilities/logger.js' );
var PGClient =        require('./pg_client.js');

function QueryCreator( userId ){
	this.userId = userId;
	this.logger = new Logger();
	this.logger.setIdentifier( userId );
	this.client = new PGClient( this.logger, 12000 );

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


/*
	Get query for retrieving updates for objects
	Including timestamp will retrieve only newest updates
	Excluding it will retrieve all, but no deleted objects (New sync)
*/
PGBatcher.prototype.getQueryForFindingUpdatedObjects = function(table, lastUpdate){
	var allowedTables = ["todo", "tag"];
	var model = sql[table];
	if( model ){
		var query, where, order;

		// If no timestamp, return all objects that's not deleted
		where = model.userId.equals( this.userId ).and( model.deleted.notEqual( true ) );
		// If timestamp, return only updated objects after timestamp (including deleted!)
		if( lastUpdate )
			where = model.userId.equals( this.userId ).and( model.updatedAt.gt( lastUpdate ) );

		// Start preparing select query and ask for columns to return from the sql definitions
		query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
							.where( where )
		

		// If todo table, order with parent tasks first for client to not loop through subtasks before having the main task
		if(table == "todo"){
			query = query.order(model.userId, model.parentLocalId.descending)
		}

		// Prepare and give name to query
		query = query.toNamedQuery( model.className );
	}

	return query;
}

module.exports = QueryCreator;