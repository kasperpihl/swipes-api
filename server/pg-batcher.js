var _ = require('underscore');
var pgobj = require('./pg-objects.js');
var batches = [];
var newObjects = {};
var collection = {};
var updates = {};
var insertions = {};
exports.reset = function(){
  collection = {};
  newObjects = {};

  batches = [];
  updates = {};
  insertions = {};
};

exports.updates = function(){
  return updates;
};
exports.insertions = function(){
  return insertions;
}
exports.collection = function(){
  return collection;
}
exports.newObjects = function(){
  return newObjects;
}


function whiteListForClass(className){
  
  var customWhiteList; 
    if ( className == "ToDo" )
        customWhiteList = [ "title" , "notes" , "order" , "priority" , "location" ,  "repeatCount" , "schedule" , "completionDate", "repeatedDate", "repeatOption"];//[,"tags",];
    if ( className == "Tag" )
        customWhiteList = ["title"];
  
  return customWhiteList;

}
function makeCustomObjectForSQLWithWhiteList( object, className, whiteList, user){
  var prepMapping = {};
  var customUpdateObject = { "className" : className };
  var update = false;
  var action = 'insert';
  if(object.objectId){
    update = true;
    action = 'update';
    customUpdateObject.localId = object.objectId;
  }
  else if(object.tempId){
    prepMapping.localId = object.tempId;
    prepMapping.userId = user.id;
    customUpdateObject.localId = object.tempId;
  }
  else{
    console.log("couldn't handle object: " + JSON.stringify(object));
    return;
  }
  prepMapping.updatedAt = new Date();
  customUpdateObject.action = action;

  if(object.deleted){
    prepMapping.deleted = true;
  }
  else {
    for(var attribute in object){
      if(_.indexOf(whiteList,attribute) == -1)
        continue;
      var result = object[attribute];
      if((attribute == "schedule" || attribute == "completionDate" || attribute == "repeatedDate") && _.isObject(result)){
        result = new Date(result['iso'])
      }
      prepMapping[attribute] = result;
    }
  }
  
  var prep = pgobj.prepare(prepMapping); 
  
  customUpdateObject.prep = prep;
  return customUpdateObject;
}


exports.sortObjects = function(collectionToSave){
  
  if ( !collectionToSave || collectionToSave.length == 0 ) 
    return false;

  for ( var className in collectionToSave ){
    
    if ( _.indexOf( [ "ToDo" , "Tag" ], className ) == -1 ) 
      continue;
    
    collection[ className ] = {};
    newObjects[ className ] = {};
    var objects = collectionToSave[ className ];
    
    for ( var i = 0  ;  i < objects.length  ;  i++ ){
      var rawObject = objects[i];
      
      if ( !_.isObject( rawObject ) || _.isArray( rawObject ) || _.isFunction( rawObject ) ) 
        continue;

      if ( rawObject.objectId )
        collection[ className ][ rawObject.objectId ] = rawObject;
      else if ( rawObject.tempId ){
        collection[ className ][ rawObject.tempId ] = rawObject;
        newObjects[ className ][ rawObject.tempId ] = rawObject;
      }

    }
  }
};


exports.prepareSQLs = function(collectionToSave,user){
	if(!collectionToSave || collectionToSave.length == 0) 
    return false;
	for(var className in collectionToSave){
    if(_.indexOf(["ToDo","Tag"],className) == -1) 
      continue;
    var whiteList = whiteListForClass(className);
		
    updates[className] = [];
		insertions[className] = [];
		
    var objects = collectionToSave[className];
		for(var i = 0 ; i < objects.length ; i++){
			var rawObject = objects[i];
      if(!_.isObject(rawObject) || _.isArray(rawObject) || _.isFunction(rawObject)) 
        continue;
      var customObject = makeCustomObjectForSQLWithWhiteList(rawObject,className, whiteList, user);

      if(customObject){
        var targetArray = (customObject.action == "update") ? updates[className] : insertions[className];
        targetArray.push(customObject);
      }
		}
	}

};