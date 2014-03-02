var keys = require('../conf/keys.js');
var Parse = require('parse').Parse;
var forceLog = false;
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
		console.log(identifier + ': ' + message);
	}
};