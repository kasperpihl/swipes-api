var Parse = require('parse').Parse;
exports.queriesForUpdating = function(user,lastUpdate,nowTime){
  	if(!user) user = Parse.User.current();
	if(!user) return false;
	var tagQuery = queryForClassAndUser("Tag",user);
	if(lastUpdate) tagQuery.greaterThan('updatedAt',lastUpdate);
	else tagQuery.notEqualTo('deleted',true);
	if(nowTime) tagQuery.lessThanOrEqualTo('updatedAt',nowTime);
	
	var taskQuery = queryForClassAndUser("ToDo",user);
	if(lastUpdate) taskQuery.greaterThan('updatedAt',lastUpdate);
	else taskQuery.notEqualTo('deleted',true);
	if(nowTime) taskQuery.lessThanOrEqualTo('updatedAt',nowTime);
	return [tagQuery,taskQuery];
};
function queryForClassAndUser(className,user){
	var query = new Parse.Query(className);
	query.equalTo('owner',user);
	return query;
}
exports.queriesForNotFound = function(user,batch){
	var ids = {};
	/* run through batches and collect tempIds/objectIds for both Tag and ToDo */
	for(var i = 0 ; i < batch.length ; i++){
		var obj = batch[i];
		var className = obj.className;
		if(!ids[className]) ids[className] = {"tempIds":[],"objectIds":[]};
		if(obj.id) ids[className]["objectIds"].push(obj.id);
		else if(obj.get('tempId')) ids[className]["tempIds"].push(obj.get('tempId'));
	}
	var queries = [];

	for(var className in ids){
		if(!(className == "Tag" || className == "ToDo")) continue;
		var localQueries = [];
		
		if(ids[className]["tempIds"].length > 0){
			var tempIdQuery = queryForClassAndUser(className,user);
			tempIdQuery.containedIn("tempId",ids[className]["tempIds"]);
			localQueries.push(tempIdQuery);
		}
		if(ids[className]["objectIds"].length > 0){
			var objectIdQuery = queryForClassAndUser(className,user);
			objectIdQuery.containedIn("objectId",ids[className]["objectIds"]);
			localQueries.push(objectIdQuery);
		}
		if(localQueries.length > 0){
			if(localQueries.length == 1) queries.push(localQueries[0]);
			else{
				queries.push(Parse.Query.or(localQueries[0],localQueries[1]));
			}
		}
	}
	return queries;
}
exports.queriesForDuplications = function(user,tempIds){
	if(!user) user = Parse.User.current();
	if(!user) return false;
	var queries = [];
	var tagTempIds = tempIds["Tag"];
	var chunkSize = 200;
	if(tagTempIds && tagTempIds.length > 0){
		for (i = 0, j = tagTempIds.length; i < j; i += chunkSize) {
			var chunk = tagTempIds.slice(i, i + chunkSize);
			var tagQuery = queryForClassAndUser("Tag",user);
			tagQuery.containedIn('tempId',chunk);
      		queries.push(tagQuery);
    	}
	}

	var taskTempIds = tempIds['ToDo'];
	if(taskTempIds && taskTempIds.length > 0){
		for (i = 0, j = taskTempIds.length; i < j; i += chunkSize) {
			var chunk = taskTempIds.slice(i, i + chunkSize);
			var taskQuery = queryForClassAndUser("ToDo",user);
			taskQuery.containedIn('tempId',chunk);
			queries.push(taskQuery);
    	}
		
	}
	
	return queries;
}