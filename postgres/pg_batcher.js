var _ = require('underscore');
var sql = require('../database/sql_definitions.js');
var BatchUpdateQueryCreator = require('../database/batch_update_query_creator.js');

var Collections = require('../collections/collections.js');
var Models = require('../models/models.js');

function PGBatcher( objects , userId, logger ){
  this.userId = userId;
  this.logger = logger;
  this.error = false;
  this.reset();
  this.loadObjects( objects, userId );
};

PGBatcher.prototype.reset = function(){
  this.todoCollection = new Collections.Todo();
  this.tagCollection = new Collections.Tag();
  this.collections = { "Tag" : this.tagCollection, "ToDo": this.todoCollection };
  this.deletedModels = [];
};



/*
  Running this function parses the JSON from sync into objects and sorts them into the collections
  It extracts 
*/
PGBatcher.prototype.loadObjects = function( collections, userId ){
  if ( !collections || collections.length == 0 ) 
    return false;

  for ( var className in collections ){
    var objects = collections[ className ];
    var collection;
    if ( className == "ToDo" )
      collection = this.todoCollection;
    else if( className == "Tag" )
      collection = this.tagCollection;

    if( collection ){
      collection.loadObjects( objects, userId );
      

      // Error handling - invalid model from collection
      if( collection.errorModels.length > 0 ){
        for( var index in collection.errorModels ){
          var model = collection.errorModels[ index ];
          if( model.get("validationError") && model.get("validationError") == "corruptdata" ){
            this.deletedModels.push(model);
          }
          else{
            this.error = { "code" :158, "message": model.get("validationError") };
          }
        }
      }
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




PGBatcher.prototype.getQueriesForInsertingAndSavingObjects = function( batchSize ){

  var returnQueries = [];
  var updateQueries = [];
  var self = this;
  for ( var className in this.collections ){
    var collection = this.collections[ className ].groupBy(function( model){ 
      model.set({}, { validate:true });
      if ( model.validationError ){
        if(model.get("deleted"))
          return "ignore";
        self.error = { code: 157, message: model.validationError, hardSync: true };
        return 'invalid';
      }
      return ( model.get('databaseId') ? 'update' : 'insert' ) 
    });

    if ( collection['invalid'] ){
      return ;
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

    query = new BatchUpdateQueryCreator( model._name, "id" , { "updatedAt" : "now()" } );
    for ( var i in updates ){
      var obj = updates[ i ];
      query.addObjectUpdate( obj.toJSON() , obj.get('databaseId') );

      if( query.objectCounter == batchSize ){
        pushQuery( query );
        query = new BatchUpdateQueryCreator( model._name, "id", { "updatedAt" : "now()" } );
      }
    }
    if( query.objectCounter > 0)
      pushQuery( query );
    
  }

  return ( returnQueries.length > 0 ) ? returnQueries : false;

};



PGBatcher.prototype.getQueriesForFindingUpdates = function(lastUpdate){
  
  var models = [ sql.todo, sql.tag ];
  var queries = [];
  for ( var i in models ){
    var query, 
        model = models[ i ],
        where = model.userId.equals( this.userId )
                          .and( model.deleted.notEqual( true ) );
    if( lastUpdate )
      where = model.userId.equals( this.userId )
                          .and( model.updatedAt.gt( lastUpdate ) );
      

    if (i == 0){ 
      // Todo
      var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
                     .where( where )
                     .order( model.userId, model.parentLocalId.descending )
                     .toNamedQuery( model.className );
    }
    else if (i == 1){
      // Tag
      var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
                     .where( where )
                     .order( model.title )
                     .toNamedQuery( model.className );
    }

    queries.push(query);
  }
  return queries;
}

PGBatcher.prototype.prepareReturnObjectsForResult = function( result, lastUpdate ){
  var resultObjects = {};

  var biggestTime;
  for ( var className in result ){
    if ( !( className == "Tag" || className == "ToDo" ) )
      continue;
    var isTodo = ( className == "ToDo" );
    for ( var index in result [ className ] ){
      
      var localObj = result[className][index];

      if ( !biggestTime || localObj.updatedAt > biggestTime )
        biggestTime = localObj.updatedAt;
      
      sql.parseObjectForClass( localObj , className );
    }
    
    resultObjects[ className ] = result[ className ];

    if ( biggestTime ){
      resultObjects.updateTime = biggestTime.toISOString();
    }
  }
  for( var index in this.deletedModels ){
    var model = this.deletedModels[ index ];
    
    if( model && model.get("localId") ){
      if( !resultObjects[ model.className ] ){

        resultObjects[model.className] = [];
      }
      resultObjects[ model.className ].push( { "objectId": model.get("localId"), "tempId": model.get("localId"), "deleted": true } );
    }
  }
  return resultObjects;
}




module.exports = PGBatcher;