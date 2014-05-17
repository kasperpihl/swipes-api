exports.cleanDup = function(userId,callback){
  Parse.Cloud.useMasterKey();
  var toDoQuery = new Parse.Query('Tag');
  toDoQuery.equalTo("owner",new Parse.User({objectId:userId}));
  var date = new Date();
  //toDoQuery.greaterThan('schedule',date);
  //toDoQuery.doesNotExist('title');
  //toDoQuery.equalTo("deleted",true);
  //toDoQuery.lessThan('completionDate',date);
  //toDoQuery.equalTo("deleted",true);
  //toDoQuery.notEqualTo('deleted',true);
  //var date = new Date();
  //toDoQuery.exists('tags');
  //
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
       object.set('deleted',true);
       objectsToDelete.push(object);
       continue;
        
        /*object.set('deleted',true);
        object.set('lastSave',new Parse.User({objectId:userId}));
        objectsToDelete.push(object);
        continue;*/
        var attr = "tempId";
        if(!object.get(attr)) continue;
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
      var counter = 1;
      return;
      queue.run(function(batch){
        console.log('starting batch ' + counter++);
        Parse.Object.destroyAll(batch,{success:function(result){
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
