var _ = require('underscore');
var sql = require('./pg_sql.js');
var CaseUpdateQuery = require('./case_update_query.js');

var Collections = require('./collections/collections.js');
var Models = require('./models/models.js');

function PGBatcher( objects , userId, logger ){
  this.userId = userId;
  this.logger = logger;
  this.error = false;
  this.reset();
  this.sortObjects( objects, userId );
};

PGBatcher.prototype.reset = function(){
  this.todoCollection = new Collections.Todo();
  this.tagCollection = new Collections.Tag();
  this.collections = { "Tag" : this.tagCollection, "ToDo": this.todoCollection };
  
};

/*
  Generating queries for SQL
*/

PGBatcher.prototype.getQueriesForFindingIdsFromLocalIds = function( batchSize ){

  var queries = [];


  var objects = [ this.tagCollection.pluck('localId') , this.todoCollection.pluck('localId') ];

  for( var i in objects ){

    var localIds = objects[ i ];
    if ( !localIds || localIds.length == 0 )
      continue;
    
    var chunks = [];
    while ( localIds.length > 0 )
      chunks.push( localIds.splice( 0, batchSize ) );
    
    var model = ( i == 0 ) ? sql.tag : sql.todo;
    for( var index in chunks ){
      var queryName = ( i == 0 ) ? "Tag"+index : "ToDo"+index;
      var chunk = chunks[ index ];
      var query = model.select( model.id, model.localId )
                      .from( model )
                      .where( model.userId.equals( this.userId )
                                          .and( model.localId.in( chunk ) ) )
                      .toNamedQuery( queryName );
      query.numberOfRows = chunk.length;

      queries.push(query);
    }
    
  
  }

  return ( queries.length > 0 ) ? queries : false;

};

PGBatcher.prototype.getQueriesForInsertingAndSavingObjects = function( batchSize ){

  var returnQueries = [];
  var updateQueries = [];

  for ( var className in this.collections ){
    var collection = this.collections[ className ].groupBy(function( model){ 
      //model.set({}, { validate:true });
      /*if ( model.validationError ){
        return 'invalid';
      }*/
      return ( model.get('databaseId') ? 'update' : 'insert' ) 
    });
    if ( collection['invalid'] ){
      console.log('invalid');
      for ( var model in collection['invalid'] ){
        this.logger.log( model.validationError );
      }
      return;
    }
    
    var updates = collection['update'];
    var insertions = collection['insert'];

    var model = sql.objectForClass( className );
    

    function pushQuery( query, numberOfRows ){
      query = query.toQuery();
      
      if( numberOfRows )
        query.numberOfRows = numberOfRows;
      
      returnQueries.push( query );

    };

    var query = model;
    var batchCounter = 0;

    for ( var i in insertions ){
      var obj = insertions[ i ];
      query = query.insert( obj.toJSON() );
      if ( ++batchCounter >= batchSize ){
        pushQuery( query, batchCounter );
        batchCounter = 0;
        query = model; 
      }
    }

    if ( batchCounter > 0){
      pushQuery( query, batchCounter );
    }

    query = new CaseUpdateQuery( model._name, "id" , { "updatedAt" : "now()" } );
    for ( var i in updates ){
      var obj = updates[ i ];
      query.addObjectUpdate( obj.toJSON() , obj.get('databaseId') );

      if( query.objectCounter == batchSize ){
        pushQuery( query );
        query = new CaseUpdateQuery( model._name, "id", { "updatedAt" : "now()" } );
      }
    }
    if( query.objectCounter > 0)
      pushQuery( query );
    
  }

  return ( returnQueries.length > 0 ) ? returnQueries : false;

};


PGBatcher.prototype.getInitialRelationshipQueries = function(){

  var todosToUpdate = this.todoCollection.filter(function ( model ){
    return ( model.relations.tags ? true : false );
  });
  var localIds = _.pluck( todosToUpdate, "id" );

  if ( localIds.length == 0 )
    return false;

  var tagKey = "tag", todoKey = "todo";
  var tagModel = sql.tag, todo = sql.todo;
  
  var tagQuery = tagModel.select( tagModel.id, tagModel.localId )
                         .where( tagModel.userId.equals( this.userId ) )
                         .toNamedQuery( tagKey );

  var todoQuery = todo.update( { "tagsLastUpdate" : "now()" , "updatedAt" : "now()" } )
                      .where( todo.userId.equals( this.userId )
                                          .and( todo.localId.in( localIds ) ) )
                      .returning( todo.id , todo.localId )
                      .toNamedQuery( todoKey );
  
  return [ tagQuery , todoQuery ];

};

PGBatcher.prototype.getFinalRelationshipQueriesWithResults = function( result, batchSize ){
  var tagKey = "tag", todoKey = "todo";
  var lookup = { "tag": {} , "todo": {} };

  var todo_tag = sql.todo_tag;

  // Create lookup dictionary for id/localId 
  var queries = new Array();
  var updatedToDoIds = new Array();

  for ( var className in result ){
    
    var isTodo = ( className == todoKey );
    
    for ( var index in result[ className ] ){
      
      var obj = result[ className ][ index ];
      var identifier = obj.id;
      lookup[ className ][ obj.localId ] = identifier;
      
      if ( isTodo )
        updatedToDoIds.push( identifier );
    
    }
  
  }

  var deleteTagRelationQuery = todo_tag['delete']().where( todo_tag.userId.equals( this.userId )
                                                                          .and( todo_tag.todoId.in( updatedToDoIds ) ) ).toQuery();

  queries.push( deleteTagRelationQuery );

  // chaining the insertion of tag relations into one query
  // using added to test whether anything was inserted (check if removed all tags from task)
  var insertTagRelationQuery = sql.todo_tag, batchCounter = 0;
  for ( var todoLocalId in lookup[ todoKey ] ){
    var todoModel = this.todoCollection.get( todoLocalId );
    console.log( todoModel );
    var tagsToUpdate = todoModel.relations.tags;
    var todoId = lookup[ todoKey ][ todoLocalId ];
    
    if ( !todoId )
      continue;
    
    var order = 1;
    
    for ( var i in tagsToUpdate ){
      
      var tagLocalId = tagsToUpdate[ i ];
      var tagId = lookup[ tagKey ][ tagLocalId ];
      
      if ( tagId ){
        insertTagRelationQuery = insertTagRelationQuery.insert( { "userId" : this.userId , "todoId": todoId , "tagId": tagId , "order": order } );
        order++;
        if ( ++batchCounter >= batchSize ){
          queries.push( insertTagRelationQuery.toQuery() );
          batchCounter = 0;
          insertTagRelationQuery = sql.todo_tag;
        }
      }

    }
  }

  if ( batchCounter > 0 )
    queries.push( insertTagRelationQuery.toQuery() );

  return queries;

};

PGBatcher.prototype.getQueriesForFindingUpdates = function(lastUpdate){
  
  var todo = sql.todo, 
      tag = sql.tag, 
      todo_tag = sql.todo_tag;

  var models = [ todo_tag , tag, todo ];
  var queries = [];
  for ( var i in models ){
    var query, 
        model = models[ i ],
        where = model.userId.equals( this.userId );
    
    // Model is todo_tag relation
    if ( i == 0 ){

      if ( lastUpdate )
        where = model.userId.equals( this.userId ).and( todo.tagsLastUpdate.gt( lastUpdate ) );
      
      var todosWithRelation = model.leftJoin( todo )
                                   .on( model.todoId.equals( todo.id ) )
                                   .leftJoin( tag )
                                   .on( model.tagId.equals( tag.id ) );
      
      query = model.select( todo.localId.as("todoLocalId") , tag.localId.as("tagLocalId"), model.order )
                    .from( todosWithRelation )
                    .where( where )
                    .order( todo.localId , model.order )
                    .toNamedQuery("todo_tags");  
    }
    // Model is tag and todo
    else{

      if( lastUpdate )
        where = model.userId.equals( this.userId )
                            .and( model.updatedAt.gt( lastUpdate ) );
        
        var query = model.select.apply( model, sql.retColumns( model ) )
                         .where( where )
                         .toNamedQuery( model.className );
    }

    queries.push(query);
  }
  
  return queries;
}



PGBatcher.prototype.updateCollectionToDetermineUpdatesWithResult = function( className , results ){
  if ( className.indexOf("Tag") == 0 )
    className = "Tag";
  else if ( className.indexOf( "ToDo" ) == 0 )
    className = "ToDo";
  var collection = this.collections[ className ];
  for( var i in results ){
    var row = results[ i ];
    var model = collection.get( row.localId );
    if ( model ) 
      model.set( { "databaseId" : row.id } );
  }

};

/*
  Running this function parses the JSON from sync into objects and sorts them into this.collection
  It extracts 
*/
PGBatcher.prototype.sortObjects = function( collectionToSave, userId ){
  
  if ( !collectionToSave || collectionToSave.length == 0 ) 
    return false;

  for ( var className in collectionToSave ){
    var objects = collectionToSave[ className ];
    if ( className == "ToDo" )
      this.todoCollection.loadObjects( objects, userId );
    else if( className == "Tag" )
      this.tagCollection.loadObjects( objects, userId );

  }
};





module.exports = PGBatcher;