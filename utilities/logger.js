var keys = require('../conf/keys.js');
var _ = require('underscore');
var forceLog = true;
var live = keys.live();

function Logger(identifier){
	this.logs = [];
	this.identifier = identifier;
	this.startTime = new Date().getTime();
	this.checkPointTime = new Date().getTime();
}

Logger.prototype.setIdentifier = function( identifier ){
	this.identifier = identifier;
	if(!this.logs || this.logs.length == 0)
		return;
	for( var index in this.logs)
		this.log(this.logs[index]);
};

Logger.prototype.time = function( message , isFinal){
  
  var nowTime = new Date().getTime();
  var targetTime = isFinal ? this.startTime : this.checkPointTime;
  
  var time = nowTime - targetTime;
  
  if ( message )
  	this.log( message + ' in (' + time + " ms)");
  
  this.checkPointTime = new Date().getTime();

};

Logger.prototype.log = function( message , force ){
	
	if ( !live || force || forceLog ){
		return this.logs.push( message );
		if ( !this.identifier ){
			return this.logs.push( message );
		}
		
		if( _.isObject( message ) ){
			message = JSON.stringify( message );
		}

		message = ( this.identifier + ': ' + message );
		
		console.log( message );
	}

};

module.exports = Logger;