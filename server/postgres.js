var pg = require('pg');
var Parse = require('parse').Parse;
var _ = require('underscore');
var logger = require('./logger.js');
var conString = "postgres://kasper:tornoe89@localhost/postgres";
exports.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
exports.sync = function(body, callback){
	/*
	1. load body objects
	2. prepare & validate objects
	3. create batches to do saving

	*/
	var user = Parse.User.current();
	if(!user)
		return callback(false,errorReturn('You have to be logged in'));
	if(body.objects && !_.isObject(body.objects)) 
		return callback(false,errorReturn('Objects must be object or array'));

	var requestStartTime = new Date();
	var batcher = require('./pg-batcher.js');
  	batcher.reset();

  	//batcher.sortObjects();
  	batcher.prepareSQLs(body.objects,user);
  	startTimer();
  	var insertions = batcher.insertions();
  	var updates = batcher.updates();

	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err) 
			return console.error('could not connect to postgres', err);
		console.log('connected');
		var queue = require('./queue.js');
		queue.set('recurring',1);

		var insertedTags = insertions['Tag'];
		var insertedToDos = insertions['ToDo'];
		if ( insertedTags && insertedTags.length > 0 )
			queue.push( insertedTags, true );
		if ( insertedToDos && insertedToDos.length > 0 )
			queue.push( insertedToDos, true );
		
		var updatedTags = updates['Tag'];
		var updatedToDos = updates['ToDo'];
		if ( updatedTags && updatedTags.length > 0 )
			queue.push( updatedTags, true );
		if ( updatedToDos && updatedToDos.length > 0 )
			queue.push( updatedToDos, true );

		queue.run(function(customObject){
			console.log(customObject);
			var queryString = "";
			var replacementArray;
			if(customObject.action == 'insert'){
				queryString = "INSERT into {0} ({1}) VALUES ({2})";
				queryString = exports.format(queryString,customObject.className.toLowerCase(), customObject.prep.insertFields, customObject.prep.insertParams);
			}
			else{
				queryString = "UPDATE {0} SET {1}";
				queryString = exports.format(queryString,customObject.className.toLowerCase(), customObject.prep.updateFields );
			}
			console.log(queryString);
			client.query(queryString,customObject.prep.values, function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				console.log("resulted query");
				console.log(result);
				//output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
				queue.next();//
			});
		},function(finished){
			console.log('finished');
			client.end();
		});
		
	});
	

  	for(var customObject in updates){

  	}
	/*pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		var now = new Date();
		client.query('INSERT INTO todo ("localId", "title", "updatedAt", "userId") VALUES ( $1, $2, $3, $4 )',["local1","tag 1",now,user.id], function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			console.log(result);
			//output: 1
		});
	});*/
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