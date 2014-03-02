var _ = require('underscore');
var queue = [];
/* BOOL that is set when the queue has been completed */
var calledDone = false;

var iterator = -1;
var doneCounter = 0;
var isRunningQueue = false;

var doneCallback;
var iteratorCallback;

var options = {
	recurring:3
};
exports.push = function(object,isCollection){
	if(isCollection && _.isArray(object)){
		for(var i = 0 ; i < object.length ; i++)
			queue[queue.length] = object[i];
	}
	else queue[queue.length] = object;
};
exports.getQueue = function(){
	return queue;
};
exports.set = function(name,value){
	if(name == 'recurring'){
		value = parseInt(value,10);
		//if(!(value >= 1 && value <= 3)) return;
	}
	options[name] = value;
};
/* Called */
function nextItem(){
	iterator = iterator + 1;
	if(iterator>=queue.length){
      return;
    }
	if(iteratorCallback) iteratorCallback(queue[iterator]);
	else exports.next();
}
/* resets the queue - removes all the objct*/

function checkDone(){
	if(calledDone) return;
	if(doneCounter == queue.length){
		calledDone = true;
      	isRunningQueue = false;
      	if(doneCallback) doneCallback(true);
    }
    else nextItem();
}

exports.next = function(){
	doneCounter++;
    checkDone();
};
exports.reset = function(){
	queue = [];
	iterator = -1;
  	doneCounter = 0;
  	calledDone= false;
  	iteratorCallback = false;
  	doneCallback = false;
}
exports.run = function(iterator,done){
	if(isRunningQueue) return done(false);
	isRunningQueue = true;
	if(queue.length === 0) return done(false);
	if(_.isFunction(iterator)) iteratorCallback = iterator;
	if(_.isFunction(done)) doneCallback = done;
  	for(var i = 0 ; i < options["recurring"] ; i++){
    	nextItem();
  	}
};