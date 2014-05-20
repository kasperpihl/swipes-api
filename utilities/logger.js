var _ = require('underscore');

function Logger(identifier){
	this.logs = [];
	this.forceOutput = false;
	this.identifier = identifier;
	this.startTime = new Date().getTime();
	this.checkPointTime = new Date().getTime();
}

Logger.prototype.setIdentifier = function( identifier ){
	this.identifier = identifier;
	this.log("identified user: " + identifier);
};

Logger.prototype.getTime = function(){
	var nowTime = new Date().getTime();
  var targetTime = this.checkPointTime;
  
  var time = nowTime - targetTime;
  return time;
}

Logger.prototype.time = function( message , isFinal){
  
  var nowTime = new Date().getTime();
  var targetTime = isFinal ? this.startTime : this.checkPointTime;
  
  var time = nowTime - targetTime;
  
  if ( message )
  	this.log( message + ' in (' + time + " ms)");
  
  this.checkPointTime = new Date().getTime();
};

Logger.prototype.log = function( message , force ){
	
	if ( this.forceOutput || force ){

		if( _.isObject( message ) ){
			message = JSON.stringify( message );
		}

		if ( this.identifier ){
			message = ( this.identifier + ': ' + message );
		}
		console.log( message );
	}
	this.logs.push( message );
};

module.exports = Logger;