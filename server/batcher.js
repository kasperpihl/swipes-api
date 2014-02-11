var _ = require('underscore');
var Parse = require('parse').Parse;
var batches = [];
var collection = {};
var newObjects = {};
exports.reset = function(){
  batches = [];
  collection = {};
  newObjects = {};
}
exports.newObjects = function(){
	return newObjects;
}
exports.todo = function(id){
	return collection["ToDo"][id];
};
exports.tag = function(id){
	return collection["Tag"][id];
}
/*

*/
exports.findDeletedObjectsAndDuplicates = function(batch,results){
  var returnObj = {"deleted":[]};
  var localCollection = {};
  // Run through results and sort them by objectId and tempId <- for duplicated / deletions
  for(var className in results){
    var result = results[className];
    localCollection[className] = {"tempIds":{},"objectIds":[]};
    for(var i = 0 ; i < result.length ; i++){
      var object = result[i];
      localCollection[className]["objectIds"].push(object.id);
      if(object.get('tempId')) localCollection[className]["tempIds"][object.get('tempId')] = object.id;
    }
  }
  var newBatch = [];
  for(var i = 0 ; i < batch.length ; i++){
    var object = batch[i];
    if(object.id && (!localCollection[object.className] || _.indexOf(localCollection[object.className]["objectIds"],object.id) == -1)){
      returnObj.deleted.push({objectId:object.id,parseClassName:object.className,deleted:true});
      continue;
    }
    // if object didn't have objectId but have a tempId existing it would be a duplicate
    else if(object.get('tempId') && localCollection[object.className] && localCollection[object.className]["tempIds"][object.get('tempId')]){
      object.id = localCollection[object.className]["tempIds"][object.get('tempId')];
    }
    newBatch.push(object);
  }
  returnObj.batch = newBatch;;
  return returnObj;
}
exports.makeParseObjectsFromRaw = function(collectionToSave,user){
	if(!collectionToSave || collectionToSave.length == 0) return false;
	for(var className in collectionToSave){
    if(_.indexOf(["ToDo","Tag"],className) == -1) continue;
		collection[className] = {};
		newObjects[className] = [];
		var objects = collectionToSave[className];
		var ParseObject = Parse.Object.extend(className);
		for(var i = 0 ; i < objects.length ; i++){
			var rawObject = objects[i];
      if(!_.isObject(rawObject) || _.isArray(rawObject) || _.isFunction(rawObject)) continue;
			var parseObject = new ParseObject(rawObject);
      parseObject.set('lastSave',user);
			if(parseObject.id){
				collection[className][parseObject.id] = parseObject;
			}
			else{
				if(parseObject.has('tempId')){ 
					collection[className][parseObject.get('tempId')] = parseObject;
					newObjects[className].push(parseObject.get('tempId'));
				}
				else collection[className][parseObject.get('title')] = parseObject;
			}
		}
	}	
  	return collection;
};
exports.newObjectsForBatch = function(batch){
	var localNewObjects = {};
	if(!batch || batch.length == 0) return false;
	for(var i = 0 ; i < batch.length ; i++){
		var parseObject = batch[i];
		if(parseObject.id) continue;
		if(parseObject.get('tempId')){
			var tempId = parseObject.get('tempId');
			var className = parseObject.className;
			if(!localNewObjects[className]) localNewObjects[className] = [];
			localNewObjects[className].push(tempId);
		}
	}
	return localNewObjects;
}
exports.updateDuplicates = function(duplicates){
	if(!duplicates) return false;
	for(var i = 0 ; i < duplicates.length ; i++){
		var duplicateObject = duplicates[i];
		if(duplicateObject.id && duplicateObject.get('tempId')){
      var localCollection = collection[duplicateObject.className];
      if(localCollection){
  			var parseObject = localCollection[duplicateObject.get('tempId')];
  			if(parseObject) parseObject.id = duplicateObject.id;
      }
		}
	}
}
exports.makeBatches = function(col){
	batches = [];
  if(!col) col = collection;
  var todoObjects = col["ToDo"];
  var tagObjects = col["Tag"];
  if(!todoObjects && !tagObjects) return batches;
  var noRelation = new Array();
  var dependency = new Array();
  var tagIdentifiers = new Array();
  var chunkSize = 50;
  /* Preparing todo's - checking for relation dependencies */
  for(var identifier in todoObjects){
    var todo = todoObjects[identifier];
    /* Checking tags */
    var tags = todo.get('tags');
    if(!tags){
      noRelation.push(todo); 
    }
    else{
      var dependent = false;
      var Tag = Parse.Object.extend("Tag");
      var localTags = new Array();
      for(var i = 0 ; i < tags.length ; i++){
        var rawTag = tags[i];
        if(!rawTag) continue;
        var tagObj;
        if(rawTag.objectId){
          tagObj = new Tag({"objectId":rawTag.objectId});
        }
        else if(rawTag.tempId){ 
          tagObj = tagObjects[rawTag.tempId];
          if(tagObj){ 
            tagIdentifiers.push(rawTag.tempId);
            dependent = true;
          }
        }        
        if(tagObj) localTags.push(tagObj);
      }
      todo.set("tags",localTags);
      if(dependent) dependency.push(todo);
      else noRelation.push(todo);
    }
  }
  var testTags = false;
  if(tagIdentifiers.length > 0){
    _.uniq(tagIdentifiers);
    testTags = true;
  }
  for(var identifier in tagObjects){
    var dependent = false;
    var tag = tagObjects[identifier];
    if(testTags && _.indexOf(tagIdentifiers,identifier) != -1) dependent = true;
    if(dependent) dependency.push(tag);
    else noRelation.push(tag);
  }
  
  if(noRelation.length > 0){
    for (i = 0, j = noRelation.length; i < j; i += chunkSize) {
      batches.push(noRelation.slice(i, i + chunkSize));
    }
  }

  if(dependency.length > 0){
    var lastBatch = batches[batches.length];
    if(lastBatch && (lastBatch.length + dependency) <= 50) lastBatch = lastBatch.concat(dependency);
    else batches.push(dependency);
  }
  return batches;
};