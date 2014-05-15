var _ = require('underscore');
var sql = require('./pg-sql.js');
function PgBatcher(){
  this.reset();
};

PgBatcher.prototype.reset = function(){
  this.batches = [];
  this.collection = {};
  this.localIds = {};
  this.relations = { "tags": {} };
};

PgBatcher.prototype.getCollection = function(){
  return this.collection;
};

PgBatcher.prototype.getLocalIds = function(){
  return this.localIds;
};
PgBatcher.prototype.getRelations = function(){
  return this.relations;
};

PgBatcher.prototype.batch = function(col){
  if ( !col )
    col = this.collection;
  var insertions = { "Tag" : [], "ToDo" : [] };
  var updates = { "Tag" : [], "ToDo" : [] };
  for ( var className in col ){
    for ( var localId in col[ className ] ){
      var obj = col[ className ][ localId];
      var targetArray = (obj.action == 'insert') ? insertions[className] : updates[className];
      
      targetArray.push(obj);
    }
  }
  return { "insertions" : insertions , "updates" : updates };
};

PgBatcher.prototype.handleTagRelation = function(localId, tags){
  
}

PgBatcher.prototype.makeCustomObjectForSQL = function( object, sqlModel, userId){
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

        var tagsArray = new Array(); 
        for ( var index in result ){
          var relation = result[ index ];
          var identifier = relation.objectId;
          if(!identifier)
            identifier = relation.tempId;
          if(identifier)
            tagsArray.push(identifier);
        }
        customUpdateObject.tags = tagsArray;
        this.relations.tags[customUpdateObject.localId] = tagsArray;
      }

      if ( !sqlModel.hasColumn( attribute ) )
        continue;
      else if ( ( attribute == "schedule" || attribute == "completionDate" || attribute == "repeatedDate" ) && _.isObject( result ) ){
        result = new Date( result['iso'] );
      }
      objectUpdates[ attribute ] = result;
    
    }
  }
  
  //var prep = pgobj.prepare( prepMapping ); 
  
  customUpdateObject.updates = objectUpdates;
  return customUpdateObject;
}


PgBatcher.prototype.sortObjects = function(collectionToSave, userId, logger){
  
  if ( !collectionToSave || collectionToSave.length == 0 ) 
    return false;

  for ( var className in collectionToSave ){
    
    var sqlModel = sql.objectForClass(className);
    if(!sqlModel)
      continue;
    
    this.collection[ className ] = {};
    this.localIds[ className ] = [];
    
    var objects = collectionToSave[ className ];
    
    for ( var i = 0  ;  i < objects.length  ;  i++ ){
      var rawObject = objects[i];
      
      if ( !_.isObject( rawObject ) || _.isArray( rawObject ) || _.isFunction( rawObject ) ) 
        continue;
      var customObject = this.makeCustomObjectForSQL( rawObject , sqlModel , userId );

      if(customObject){
        this.collection[ className ][ customObject.localId ] = customObject;
        this.localIds[ className ].push( customObject.localId );

      }

    }
  }
};

module.exports = PgBatcher;