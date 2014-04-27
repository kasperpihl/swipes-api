var keys = require('../conf/keys.js');
var _ = require('underscore');
var Parse = require('parse').Parse;
var forceLog = true;
var live = keys.live();
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
		var identifier = Parse.User.current().id;
		if(!identifier) identifier = makeid(5);
		if(_.isObject(message)){ 
			message = JSON.stringify(message);
			console.log("stringify");
		}
		console.log(identifier + ': ' + message);
	}
};