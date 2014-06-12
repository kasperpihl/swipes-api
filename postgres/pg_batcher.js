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


PGBatcher.prototype.getInitialRelationshipQueries = function( chunkSize ){

  var tagKey = "tag", todoKey = "todo";
  var tagModel = sql.tag, todo = sql.todo;

  /* Fetch all tags to lookup id's in tag relations */
  var tagQuery = tagModel.select( tagModel.id, tagModel.localId )
                         .where( tagModel.userId.equals( this.userId ) )
                         .toNamedQuery( tagKey );
  var queries = [ tagQuery ];

  var relationLocalIds = {};
  var todosWithTagsToUpdate = this.todoCollection.filter(function ( model ){
    return ( model.relations.tags ? true : false );
  });
  var relationTagsLocalIds = _.pluck( todosWithTagsToUpdate, "id" );
  if ( relationTagsLocalIds && relationTagsLocalIds.length > 0 )
    relationLocalIds[ "tags" ] = relationTagsLocalIds;
  
  var todosWithAttachmentsToUpdate = this.todoCollection.filter( function ( model ){
    return model.relations.attachments ? true : false;
  });

  var relationAttachmentsLocalIds = _.pluck( todosWithAttachmentsToUpdate, "id" );
  if ( relationAttachmentsLocalIds && relationAttachmentsLocalIds.length > 0 )
    relationLocalIds[ "attachments" ] = relationAttachmentsLocalIds;
  
  for ( var index in relationLocalIds ){
    var localIds = relationLocalIds[ index ];
    for ( var i = 0, j = localIds.length;   i < j;    i += chunkSize  ) {
      var chunk = localIds.slice( i , i + chunkSize );
      if( chunk.length == 0 )
        continue;
        var updateKey = index + "LastUpdate";
        updateObject = { "updatedAt": "now()" };
        updateObject[ updateKey ] = "now()";
        var todoQuery = todo.update( updateObject )
                        .where( todo.userId.equals( this.userId )
                                            .and( todo.localId.in( chunk ) ) )
                        .returning( todo.id , todo.localId )
                        .toNamedQuery( todoKey+"-"+index+i );
        todoQuery.numberOfRows = chunk.length;
        queries.push( todoQuery );
      }
  }

  
  return queries;

};

PGBatcher.prototype.getFinalRelationshipQueriesWithResults = function( result, batchSize ){
  var tagKey = "tag", todoKey = "todo";
  var lookup = { "tag": {} , "todo": {} };

  
  

  // Create lookup dictionary for id/localId and sort for relation actions
  var queries = new Array();
  var updatedToDoIds = new Array();
  var updatedToDoTags = new Array();
  var updatedToDoAttachments = new Array();

  for ( var className in result ){
    var lookupIndex = className;
    var relAttachments, relTags;
    var isTodo = ( className.indexOf(todoKey) > -1 );
    if ( isTodo ){
      lookupIndex = todoKey;
      relAttachments = (className.indexOf( todoKey + "-attachments") > -1);
      relTags = ( className.indexOf( todoKey + "-tags") > -1 );
    }
    
    for ( var index in result[ className ] ){
      
      var obj = result[ className ][ index ];
      var identifier = obj.id;
      lookup[ lookupIndex ][ obj.localId ] = identifier;
      
      if ( relAttachments )
        updatedToDoAttachments.push( identifier );
      if ( relTags )
        updatedToDoTags.push( identifier );
    
    }
  }

  // Cleaning the tags relation objects
  var todo_tag = sql.todo_tag;
  for ( var i = 0, j = updatedToDoTags.length;   i < j;    i += batchSize  ) {

      var chunk = updatedToDoTags.slice( i , i + batchSize );
      if ( chunk.length == 0 )
        continue;
      var deleteTagRelationQuery = todo_tag['delete']().where( todo_tag.userId.equals( this.userId )
                                                                          .and( todo_tag.todoId.in( chunk ) ) ).toQuery();
      deleteTagRelationQuery.numberOfRows = chunk.length;
      queries.push( deleteTagRelationQuery );
  }
  
  // Cleaning the attachment objects
  var todo_attachment = sql.todo_attachment;
  for ( var i = 0, j = updatedToDoAttachments.length;   i < j;    i += batchSize  ) {

      var chunk = updatedToDoAttachments.slice( i , i + batchSize );
      if ( chunk.length == 0 )
        continue;
      var deleteTagRelationQuery = todo_attachment['delete']().where( todo_attachment.userId.equals( this.userId )
                                                                          .and( todo_attachment.todoId.in( chunk ) ) ).toQuery();
      deleteTagRelationQuery.numberOfRows = chunk.length;
      queries.push( deleteTagRelationQuery );
  }


  // chaining the insertion of tag relations into one query
  // using added to test whether anything was inserted (check if removed all tags from task)
  var insertTagRelationQuery = sql.todo_tag, insertTagCounter = 0, insertAttachmentCounter = 0;
  var insertAttachmentRelationQuery = sql.todo_attachment;
  for ( var todoLocalId in lookup[ todoKey ] ){
    var todoModel = this.todoCollection.get( todoLocalId );
    var tagsToUpdate = todoModel.relations.tags;
    var attachmentsToUpdate = todoModel.relations.attachments;
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
        if ( ++insertTagCounter >= batchSize ){
          insertTagRelationQuery = insertTagRelationQuery.toQuery();
          insertTagRelationQuery.numberOfRows = batchSize;
          queries.push( insertTagRelationQuery );
          insertTagCounter = 0;
          insertTagRelationQuery = sql.todo_tag;
        }
      }

    }


    for ( var i in attachmentsToUpdate ){
      
      var attachment = attachmentsToUpdate[ i ];
      
      if ( attachment ){
        insertAttachmentRelationQuery = insertAttachmentRelationQuery.insert( { "userId" : this.userId , "todoId": todoId , title : attachment.title , service: attachment.service, identifier: attachment.identifier, sync: attachment.sync } );
        if ( ++insertAttachmentCounter >= batchSize ){
          insertAttachmentRelationQuery = insertAttachmentRelationQuery.toQuery();
          insertAttachmentRelationQuery.numberOfRows = batchSize;
          queries.push( insertAttachmentRelationQuery );
          insertAttachmentCounter = 0;
          insertAttachmentRelationQuery = sql.todo_tag;
        }
      }

    }


  }

  if ( insertTagCounter > 0 ){
    insertTagRelationQuery = insertTagRelationQuery.toQuery();
    insertTagRelationQuery.numberOfRows = insertTagCounter;
    queries.push( insertTagRelationQuery );
  }
  if ( insertAttachmentCounter > 0 ){
    insertAttachmentRelationQuery = insertAttachmentRelationQuery.toQuery();
    insertAttachmentRelationQuery.numberOfRows = insertAttachmentCounter;
    queries.push( insertAttachmentRelationQuery );
  }

  return queries;

};

PGBatcher.prototype.getQueriesForFindingUpdates = function(lastUpdate){
  
  var todo = sql.todo, 
      tag = sql.tag, 
      todo_tag = sql.todo_tag,
      todo_attachment = sql.todo_attachment;

  var models = [ todo_tag, todo_attachment , tag, todo ];
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
    else if ( i == 1 ){

      if ( lastUpdate )
        where = model.userId.equals( this.userId ).and( todo.attachmentsLastUpdate.gt( lastUpdate ) );
      
      var attachmentsWithRelation = model.leftJoin( todo ).on( model.todoId.equals( todo.id ) );
      query = model.select( todo.localId.as("todoLocalId"), model.identifier, model.service, model.title, model.sync )
                    .from( attachmentsWithRelation )
                    .where( where )
                    .toNamedQuery("todo_attachments");
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

PGBatcher.prototype.prepareReturnObjectsForResult = function( result ){
  var resultObjects = {};
  var tagRelations = {};
  if ( result[ "todo_tags" ] && result.todo_tags.length > 0 ){

    for ( var i in result.todo_tags ){
      
      var tagRelation = result.todo_tags[ i ];
      
      if ( !tagRelations[ tagRelation.todoLocalId ] )
        tagRelations[ tagRelation.todoLocalId ] = [];
      
      tagRelations[ tagRelation.todoLocalId ].push( { objectId : tagRelation.tagLocalId } );
   
    }
  }
  var attachmentRelations = {}
  if ( result[ "todo_attachments" ] && result.todo_attachments.length > 0 ){
    for ( var i in result.todo_attachments ){
      var attachment = result.todo_attachments[ i ];
      var identifier = attachment.todoLocalId;
      var saveObject = _.omit( attachment, "todoLocalId" );
      if ( !attachmentRelations[ identifier ] )
        attachmentRelations[ identifier ] = [];
      attachmentRelations[ identifier ].push( saveObject );
    }
  }
  var biggestTime;
  for ( var className in result ){

    if ( !( className == "Tag" || className == "ToDo" ) )
      continue;

    var isTodo = ( className == "ToDo" );
    for ( var index in result [ className ] ){
      
      var localObj = result[className][index];
      if ( !biggestTime || localObj.updatedAt > biggestTime )
        biggestTime = localObj.updatedAt;
      
      /* Update relations to json on todoobject for client */
      if ( isTodo && tagRelations[ localObj.objectId ] ){
        localObj["tags"] = tagRelations[ localObj.objectId ];
      }
      if ( isTodo && attachmentRelations[ localObj.objectId ] ){
        localObj[ "attachments" ] = attachmentRelations[ localObj.objectId ];
      }
      
      sql.parseObjectForClass( localObj , className );
    }
    
    resultObjects[ className ] = result[ className ];

    if ( biggestTime )
      resultObjects.updateTime = biggestTime.toISOString();
  }
  return resultObjects;
}


function scrapeChanges( object , lastUpdateTime ){
  
  var attributes = object.attributes;
  var updateTime = new Date();

  object.set( 'parseClassName' , object.className );
  
  var deleteAttributes = [ "owner" , "ACL" , "lastSave" ]
  for( var i in deleteAttributes ){
    var attr = deleteAttributes[ i ];
    if ( attributes[ attr ] )
      delete attributes[ attr ];
  }

  if ( !attributes[ 'attributeChanges' ] ) 
    return;
  
  if ( !lastUpdateTime ) 
    return delete attributes['attributeChanges'];
  
  var changes = object.get('attributeChanges');
  
  if ( !changes ) 
    changes = {};
  
  if ( attributes ){
    
    for ( var attribute in attributes ){
      
      var lastChange = changes[ attribute ];
      
      if ( ( attribute == "deleted" && attributes[ attribute ] ) || attribute == "tempId" || attribute == "parseClassName" ) 
        continue;
      
      if( !lastChange || lastChange <= lastUpdateTime ) 
        delete attributes[ attribute ];

    }

  }

};


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