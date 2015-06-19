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