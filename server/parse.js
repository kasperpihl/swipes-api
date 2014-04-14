var Parse = require('parse').Parse;
var _ = require('underscore');
var logger = require('./logger.js');
function scrapeChanges(object,lastUpdateTime){
  var attributes = object.attributes;
  object.set('parseClassName',object.className);
  var updateTime = new Date();
  if(attributes["owner"]) delete attributes["owner"];
  if(attributes["ACL"]) delete attributes["ACL"];
  if(attributes['lastSave']) delete attributes["lastSave"];
  if(!attributes['attributeChanges']) return;
  if(!lastUpdateTime) return delete attributes['attributeChanges'];
  var changes = object.get('attributeChanges');
  if(!changes) changes = {};
  if(attributes){
    for(var attribute in attributes){
      var lastChange = changes[attribute];
      if((attribute == "deleted" && attributes[attribute]) || attribute == "tempId" || attribute == "parseClassName") continue;
      if(!lastChange || lastChange <= lastUpdateTime) delete attributes[attribute];
    }
  }
};
/* Running a query unlimited with skips if limit of object is reached
  callback (result,error)
*/
function runQueriesToTheEnd(queries,callback){
  if(!queries || queries.length == 0) return callback(false,errorReturn("No queries to run"));
  var stopped;
  var resultObj = {};
  var i = 0;
  var internalCallback = function(result,error,query){
    i++;
    if(error && !stopped){
      callback(false,error,queries);
      stopped = true;
    }
    else if(result){
      resultObj[query.className] = result;
    }
    if(i == queries.length && !stopped) callback(resultObj,false,queries);
    else{
      runQueryToTheEnd(queries[i],internalCallback);
    }
  }
  runQueryToTheEnd(queries[i],internalCallback);
}
function runQueryToTheEnd(query,callback,deltaResult,deltaSkip){
  if(!deltaResult) deltaResult = [];
  if(!deltaSkip) deltaSkip = 0;
  if(deltaSkip) query.skip(parseInt(deltaSkip,10));
  query.limit(1000);
  query.find({success:function(result){
    var runAgain = false;
    if(result && result.length > 0){
      deltaResult = deltaResult.concat(result);
      if(result.length == 1000) runAgain = true;
    }
    if(runAgain){ 
      deltaSkip = deltaSkip + 1000;
      runQueryToTheEnd(query,callback,deltaResult,deltaSkip);
    }
    else callback(deltaResult,false,query);
  },error:function(error){
    callback(deltaResult,error,query);
  }});
};
var startTime;
function startTimer(){
  startTime = new Date().getTime();
}
function finishTimer(message, reset){
  var endTime = new Date().getTime();
  var time = endTime - startTime;
  logger.log(message + ' in (' + time + " ms)");
  if(reset) startTime = new Date().getTime();
}
exports.cleanDup = function(userId,callback){
  Parse.Cloud.useMasterKey();
  var toDoQuery = new Parse.Query('ToDo');
  toDoQuery.equalTo("owner",new Parse.User({objectId:userId}));
  //toDoQuery.notEqualTo('deleted',true);
  //var date = new Date();
  //toDoQuery.exists('tags');
  //toDoQuery.lessThan('completionDate',date);
  //toDoQuery.exists('completionDate');
  /*toDoQuery.count({success:function(counter){
    console.log(counter);
    callback("found " + counter,false);
  },error:function(error){
    console.log(error);
    callback(false,error);
  }});
  return;*/
  runQueryToTheEnd(toDoQuery,function(result,error){
    console.log("found objects: " + result.length);
    if(result){
      var objectsToDelete = [];
      var objectsByTitle = {};
      for(var i = 0 ; i < result.length ; i++){
       var object = result[i];
        /*object.set('deleted',true);
        object.set('lastSave',new Parse.User({objectId:userId}));
        objectsToDelete.push(object);
        continue;*/
        var attr = "tempId";
        var existingObject = objectsByTitle[object.get(attr)];
        if(existingObject){
          var thisUpdatedAt = object.createdAt.getTime();
          var existingUpdatedAt = existingObject.createdAt.getTime();
          //console.log(object.get('repeatCount') + ' - ' + object.get('repeatOption') + " " + existingObject.get('repeatOption'));
          if(thisUpdatedAt >= existingUpdatedAt){
            existingObject.set('deleted',true);
            objectsToDelete.push(existingObject);
            objectsByTitle[object.get(attr)] = object;
          }
          else{
            object.set('deleted',true);
            objectsToDelete.push(object);
          }
        }
        else objectsByTitle[object.get(attr)] = object;
      }
      console.log("deleting: " + objectsToDelete.length + ' keeping: ' + Object.keys(objectsByTitle).length);
      var batcher = require('./batcher.js');
      var batches = batcher.makeBatches({"ToDo":objectsToDelete});
      console.log("number of batches: " + batches.length);
      var queue = require('./queue.js');
      var queueError;
      queue.push(batches,true);
      return;
      var counter = 1;
      queue.run(function(batch){
        console.log('starting batch ' + counter++);
        Parse.Object.saveAll(batch,{success:function(result){
        queue.next();
        console.log(result.length);
        },error:function(error){
          console.log(error);
          queueError = error;
          queue.next();
        }});
      },function(finished){
        if(queueError) callback(false,queueError);
        else callback("Deleted duplicates " + objectsToDelete.length);
      });
    }
    else callback(false,error);
  });
}

exports.trial = function(userId, callback){
  Parse.Cloud.useMasterKey();
  var trialQuery = new Parse.Query('Trial')
  trialQuery.equalTo('user',new Parse.User({objectId:userId}));
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('objectId',userId);
  /*userQuery.find({success:function(users){
    callback(users,false);
  },error:function(error){ callback(false, error); }});*/
  runQueriesToTheEnd([trialQuery,userQuery],function(result,error){
    if(error) callback(false,error);
    else{
      if(result['Trial'] && result['Trial'].length > 0){
        callback(false, errorReturn('Already received trial'));
      }
      else if(result["_User"] && result["_User"].length == 1){
        var user = result["_User"][0];
        if(user.get('userLevel') > 0) return callback(false, errorReturn('Already upgraded'));
        
        var startDate = new Date();
        var noOfDays = 31;
        var endDate = new Date(startDate.getTime() + (noOfDays * (1000 * 60 * 60 * 24)));
        user.set('userLevel',1);
        var Trial = Parse.Object.extend('Trial');
        var trial = new Trial();
        trial.set('startDate',startDate);
        trial.set('endDate',endDate);
        trial.set('user',user);
        Parse.Object.saveAll([trial,user],{success:function(list){
          callback({"code":200,"message":"successful trial"});
        },error:function(list,error){
          callback(false,error);
        }});
        
      }
      else {
        callback(false,errorReturn('User not found'));
      }
    }

    
  });
}

exports.clean = function(callback){
  Parse.Cloud.useMasterKey();
  var user = Parse.User.current();
  var toDoQuery = new Parse.Query('ToDo');
  toDoQuery.equalTo('owner',user);
  var tagQuery = new Parse.Query('Tag');
  tagQuery.equalTo('owner',user);
  logger.log('starting clean for user: ' + user,true);
  var queries = [toDoQuery,tagQuery];
  var queue = require('./queue.js');
  queue.push(queries,true);
  var destroyError;
  function batchDelete(objects){
    
    var batcher = require('./batcher.js');
    var batches = batcher.makeBatches(objects);
    logger.log('starting ' + batches.length + ' batches',true);
    queue.reset();
    queue.push(batches,true);
    var counter = 0;
    queue.run(function(batch){
      counter++;
      logger.log('destroying batch ' + counter,true);
      Parse.Object.destroyAll(batch,{success:function(){
        logger.log('destroyed batch',true);
        queue.next();
      }, error:function(error){
        logger.log('error destroying batch',true);
        destroyError = error;
        queue.next();
      }});
    },function(finished){
      if(destroyError) callback(false,destroyError);
      else callback(true,false);
    });
  };
  var collection = {};
  queue.run(function(query){
    runQueryToTheEnd(query,function(result,error){
      if(result && result.length > 0){
        collection[result[0].className] = result;
        queue.next();
      }
      else queue.next();
    });
  },function(finished){
    batchDelete(collection);
    
  });
}
function errorReturn(errorName,code){
  if(!code) code = 141;
  if(!errorName) errorName = 'Server error';
  return {code : 141, message:errorName};
}
exports.sync = function(body,callback){
  Parse.Cloud.useMasterKey();
  var user = Parse.User.current();
  if(!user) return callback(false,errorReturn('You have to be logged in'));
  if(body.objects && !_.isObject(body.objects)) return callback(false,errorReturn('Objects must be object or array')); 
  var startTime = new Date();

  var batcher = require('./batcher.js');
  batcher.reset();
  
  var queryUtility = require('./queryUtility.js');
  startTimer();
  batcher.makeParseObjectsFromRaw(body.objects,user);
  var runningError;
  var lastUpdate = (body.lastUpdate) ? new Date(body.lastUpdate) : false;
  var queue = require('./queue.js');
  var recurring = parseInt(body.recurring,10);
  if(recurring > 0) queue.set('recurring',recurring);
  var deletedObjects = [];
  /* Run and check for duplicates with tempId */
  function checkForDuplicates(batch){
    var queries = queryUtility.queriesForDuplications(user,batcher.newObjects());
    if(!queries || queries.length == 0) return saveAll();
    queue.reset();
    queue.push(queries,true);
    queue.run(function(query){
      runQueryToTheEnd(query,function(result,error){
        if(result && result.length > 0){
          logger.log(result[0].className + ' found ' + result.length + ' duplicates');
          batcher.updateDuplicates(result);
        }
        else if(error) runningError = error;
        queue.next();
      });
      },function(finished){
        if(runningError) return callback(false,runningError);
        else saveAll();
    });
  };


  function saveAll(){
    finishTimer('finalized duplicates',true);
    var batches = batcher.makeBatches();

    finishTimer("prepared " + batches.length + " batches ",true);
    if(!batches || batches.length == 0) return fetchAll();
    queue.reset();
    queue.push(batches,true);
    queue.run(function(batch){
      saveBatch(batch,queue);
    },function(finished){
      if(runningError) return callback(false,runningError);
      else fetchAll();
    });
  };


  function saveBatch(batch,queue){
    logger.log('saving batch with length: '+batch.length);
    Parse.Object.saveAll(batch,{success:function(result){
        logger.log('completed batch with length '+ result.length);
        queue.next();
      },error:function(error){
        // TODO: Handle error on batches here
        handleSaveError(batch,queue,error);
      }});
  };


  function handleSaveError(batch,queue,error){
    logger.log('Error from save ' + error,true);
    /*
      If object not found or a time out
      Check for deletedobjects and duplicates
    */
    if(error.code == 101 || error.code == 124 || error.code == 100){
      var queries = queryUtility.queriesForNotFound(user,batch);
      runQueriesToTheEnd(queries,function(result,error){
        if(result){
          var deletedAndUpdatedBatch = batcher.findDeletedObjectsAndDuplicates(batch,result);
          logger.log("deleted objects: " + deletedAndUpdatedBatch.deleted.length);
          if(deletedAndUpdatedBatch.deleted.length > 0) deletedObjects = deletedObjects.concat(deletedAndUpdatedBatch.deleted);
          saveBatch(deletedAndUpdatedBatch.batch,queue);
        }
        else{
          runningError = error;
          queue.next();
        }
      });
    }
    else{
      runningError = error;
      queue.next();
    }
  };



  function fetchAll(){
    finishTimer('finished saving',true);
    queue.reset();
    var resultObjects = {};
    var updateTime = new Date();

    var queries = queryUtility.queriesForUpdating(user,lastUpdate,updateTime);
    logger.log('' + queries.length + " queries prepared");
    var biggestTimeStamp;
    queue.push(queries,true);
    queue.run(function(query){
      runQueryToTheEnd(query,function(result,error,query){
        if(!error && result && result.length > 0){
          for(var i = 0 ; i < result.length ; i++){
            if(!biggestTimeStamp || result[i].updatedAt.getTime() > biggestTimeStamp.getTime()) biggestTimeStamp = result[i].updatedAt;
            scrapeChanges(result[i],lastUpdate);
          }
          var index = query.className;
          logger.log("" + index + " resulted with " + result.length + " objects");
          resultObjects[index] = result;
          queue.next();
        }
        else{
          if(error) runningError = error;
          queue.next();
        }
      });
    },function(finished){
      finishTimer('queue finished',true);
      if(runningError) return callback(false,runningError);
      if(biggestTimeStamp) resultObjects.updateTime = biggestTimeStamp.toISOString();
      if(deletedObjects.length > 0){
        for(var i = 0 ; i < deletedObjects.length ; i++){
          var deletedObj = deletedObjects[i];
          if(!resultObjects[deletedObj.parseClassName]) resultObjects[deletedObj.parseClassName] = [];
          resultObjects[deletedObj.parseClassName].push(deletedObj);
        }
        
      }
      resultObjects.serverTime = new Date().toISOString();
      callback(resultObjects,false);
    });
  };
  checkForDuplicates();
};