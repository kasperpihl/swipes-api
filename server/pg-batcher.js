var _ = require('underscore');
var sql = require('./pg-sql.js');
var batches = [];
var localIds = {};
var collection = {};
exports.reset = function(){
  collection = {};
  localIds = {};
  batches = [];
};

exports.batch = function(col){
  if ( !col ) 
    col = collection;
  var batch = [];
  for ( var className in col ){
    for ( var localId in col[ className ] ){
      batch.push( col[ className ][ localId] );
    }
  }
  return batch;
}

exports.collection = function(){
  return collection;
}
exports.localIds = function(){
  return localIds;
}


function makeCustomObjectForSQL( object, sqlModel, userId){
  var objectUpdates = {};
  var customUpdateObject = { "sqlModel": sqlModel, action : "insert" };
  
  objectUpdates.userId = userId;

  var identifier = object.objectId ? object.objectId : (object.tempId ? object.tempId : null);
  if(identifier){
    objectUpdates.localId = identifier;
    customUpdateObject.localId = identifier;
  }
  else{
    console.log( "couldn't handle object: " + JSON.stringify( object ) );
    return;
  }
  objectUpdates.updatedAt = new Date();

  if(object.deleted){
    objectUpdates.deleted = true;
  }
  else {
    for ( var attribute in object ){
      var result = object[attribute];
      if(attribute == "tags"){
        console.log('tag');
        console.log(result);
      }
      if( !sqlModel.hasColumn(attribute) )
        continue;
      else if( ( attribute == "schedule" || attribute == "completionDate" || attribute == "repeatedDate" ) && _.isObject( result ) ){
        result = new Date( result['iso'] );
      }
      objectUpdates[ attribute ] = result;
    }
  }
  
  //var prep = pgobj.prepare( prepMapping ); 
  
  customUpdateObject.updates = objectUpdates;
  return customUpdateObject;
}


exports.sortObjects = function(collectionToSave, userId){
  
  if ( !collectionToSave || collectionToSave.length == 0 ) 
    return false;

  for ( var className in collectionToSave ){
    
    var sqlModel = sql.objectForClass(className);
    if(!sqlModel)
      continue;
    
    collection[ className ] = {};
    localIds[ className ] = [];
    
    var objects = collectionToSave[ className ];
    
    for ( var i = 0  ;  i < objects.length  ;  i++ ){
      var rawObject = objects[i];
      
      if ( !_.isObject( rawObject ) || _.isArray( rawObject ) || _.isFunction( rawObject ) ) 
        continue;
      var customObject = makeCustomObjectForSQL( rawObject , sqlModel , userId );

      if(customObject){
        collection[ className ][ customObject.localId ] = customObject;
        localIds[ className ].push( customObject.localId );

      }

    }
  }
};