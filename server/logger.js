var keys = require('../conf/keys.js');
var _ = require('underscore');
var Parse = require('parse').Parse;
var forceLog = true;
var live = keys.live();

var startTime = new Date().getTime();
var checkPointTime = new Date().getTime();
exports.time = function(message){
  var endTime = new Date().getTime();
  var time = endTime - checkPointTime;
  if(message)
  	exports.log(message + ' in (' + time + " ms)");
  checkPointTime = new Date().getTime();
}

function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
exports.log = function(message,force){
	
	if(!live || force || forceLog){
		var identifier = Parse.User.current();
		if(!identifier) identifier = makeid(5);
		else identifier = identifier.id;
		if(_.isObject(message)){
			message = JSON.stringify(message);
		}
		console.log(identifier + ': ' + message);
	}
};