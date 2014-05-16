var _ = require('underscore');
var sql = require('./pg_sql.js');
function PGBatcher( objects , userId ){
  this.reset();
  this.userId = userId;
  this.sortObjects( objects, userId );
};

PGBatcher.prototype.reset = function(){
  this.batches = [];
  this.collection = {};
  this.localIds = {};
  this.relations = { "tags": {} };
};

PGBatcher.prototype.getRelations = function(){
  return this.relations;
}

/*
  Generating queries for SQL
*/

PGBatcher.prototype.getQueriesForFindingIdsFromLocalIds = function(){

  var queries = [];
  var objects = [ this.localIds[ 'Tag'] , this.localIds[ 'ToDo' ] ];
  for( var i in objects ){

    var localIds = objects[ i ];
    if ( !localIds || localIds.length == 0 )
      continue;
    
    var model = ( i == 0 ) ? sql.tag() : sql.todo();
    var queryName = ( i == 0 ) ? "Tag" : "ToDo";
    var query = model.select( model.id, model.localId )
                      .from( model )
                      .where( model.userId.equals( this.userId )
                                          .and( model.localId.in( localIds ) ) )
                      .toNamedQuery( queryName );
    
    queries.push(query);
  
  }

  return ( queries.length > 0 ) ? queries : false;

};

PGBatcher.prototype.getQueriesForInsertingAndSavingObjects = function(){

  var returnQueries = [];
  var updateQueries = [];

  for ( var className in this.collection ){
    var model = sql.objectForClass( className );
    var insertQuery = model;
    var inserted = false;
    for ( var localId in this.collection[ className ] ){
      var obj = this.collection[ className ][ localId ];
      
      if ( obj.action == 'insert' ){
        insertQuery = insertQuery.insert(obj.updates);
        inserted = true;
      }
      else{
        var updateQuery = model.update( obj.updates ).where( model.id.equals( obj.id ) ).toQuery();
        updateQueries.push( updateQuery );
      }
    }
    
    if ( inserted )
      returnQueries.push( insertQuery.toQuery() );
  }

  returnQueries = returnQueries.concat( updateQueries );

  return ( returnQueries.length > 0 ) ? returnQueries : false;

};

PGBatcher.prototype.getInitialRelationshipQueries = function(){

  var todosToUpdate = _.keys( this.relations.tags );
  if ( todosToUpdate.length == 0 )
    return false;

  var tagKey = "tag", todoKey = "todo";
  var tagModel = sql.tag(), todo = sql.todo();
  
  // TODO: use transactions here
  var tagQuery = tagModel.select( tagModel.id, tagModel.localId )
                         .where( tagModel.userId.equals( this.userId ) )
                         .toNamedQuery( tagKey );

  var todoQuery = todo.update( { "tagsLastUpdate" : "now()" , "updatedAt" : "now()" } )
                      .where( todo.userId.equals( this.userId )
                                          .and( todo.localId.in( todosToUpdate ) ) )
                      .returning( todo.id , todo.localId )
                      .toNamedQuery( todoKey );
  
  return [ tagQuery , todoQuery ];

};

PGBatcher.prototype.getFinalRelationshipQueriesWithResults = function( result ){
  var tagKey = "tag", todoKey = "todo";
  var lookup = { "tag": {} , "todo": {} };

  var todo_tag = sql.todo_tag();

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
  var insertTagRelationQuery = sql.todo_tag(), added = false;
  for ( var todoLocalId in this.relations.tags ){

    var tagsToUpdate = this.relations.tags[ todoLocalId ];
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
        added = true;
      }

    }
  }

  if ( added )
    queries.push( insertTagRelationQuery.toNamedQuery( 'todo_tag' ) );

  return queries;

};

PGBatcher.prototype.getQueriesForFindingUpdates = function(lastUpdate){
  
  var todo = sql.todo(), 
      tag = sql.tag(), 
      todo_tag = sql.todo_tag();

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
  
  for( var i in results ){
    var row = results[ i ];

    var objInCollection = this.collection[ className ][ row.localId ];
    objInCollection.id = row.id;
    objInCollection.action = 'update';
  }

};

/*
  Running this function parses the JSON from sync into objects and sorts them into this.collection
  It extracts 
*/
PGBatcher.prototype.sortObjects = function( collectionToSave, userId, logger ){
  
  if ( !collectionToSave || collectionToSave.length == 0 ) 
    return false;

  for ( var className in collectionToSave ){
    
    var sqlModel = sql.objectForClass(className);
    if ( !sqlModel )
      continue;
    
    this.collection[ className ] = {};
    this.localIds[ className ] = [];
    
    var objects = collectionToSave[ className ];
    
    for ( var i = 0  ;  i < objects.length  ;  i++ ){
      var rawObject = objects[ i ];
      
      if ( !_.isObject( rawObject ) || _.isArray( rawObject ) || _.isFunction( rawObject ) ) 
        continue;
      var customObject = this.makeCustomObjectForSQL( rawObject , sqlModel , userId );

      if ( customObject ){
        this.collection[ className ][ customObject.localId ] = customObject;
        this.localIds[ className ].push( customObject.localId );

      }

    }
  }
};


PGBatcher.prototype.handleTagRelationsForObjectWithId = function( localId , tags ){

  var tagsArray = this.relations.tags[ localId ] = new Array();
  if ( !tags || tags.length == 0 )
    return;

  for ( var index in tags ){
    var relation = tags[ index ];
    var identifier = relation.objectId;
    if ( !identifier )
      identifier = relation.tempId;
    if ( identifier )
      tagsArray.push( identifier );
  }  
}

PGBatcher.prototype.makeCustomObjectForSQL = function( object, sqlModel, userId){
  // objectUpdates will be the direct attribute:value object to be saved in database
  var objectUpdates = {};

  // a custom object that will contain the model, actions and relevant side data
  var customUpdateObject = { "sqlModel": sqlModel, action : "insert" };
  
  objectUpdates.userId = userId;

  var identifier = object.objectId ? object.objectId : (object.tempId ? object.tempId : null);
  if ( identifier ){
    objectUpdates.localId = identifier;
    customUpdateObject.localId = identifier;
  }
  else{
    // TODO: monitor this error
    console.log( "couldn't handle object: " + JSON.stringify( object ) );
    return;
  }
  objectUpdates.updatedAt = "now()";

  if(object.deleted){
    objectUpdates.deleted = true;
  }
  else {
    for ( var attribute in object ){
      var result = object[attribute];
      
      /* Handling tags - they are not part of the model and is handled through the relationship */
      if ( attribute == "tags" ){
        this.handleTagRelationsForObjectWithId( customUpdateObject.localId , result );        
      }

      if ( !sqlModel.hasColumn( attribute ) )
        continue;

      if ( ( attribute == "schedule" || attribute == "completionDate" || attribute == "repeatedDate" ) && _.isObject( result ) ){
        result = new Date( result[ 'iso' ] );
      }

      objectUpdates[ attribute ] = result;

    }
  }
  
  customUpdateObject.updates = objectUpdates;

  return customUpdateObject;
}


module.exports = PGBatcher;