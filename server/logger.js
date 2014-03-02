var keys = require('../conf/keys.js');
var Parse = require('parse').Parse;
var forceLog = false;
var live = keys.live();
var identifier;
function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
exports.log = function(message,force){
	if(!identifier && Parse.User.current()) identifier = Parse.User.current().id;
	if(!identifier) identifier = makeid(5);
	if(!live || force || forceLog) console.log(identifier + ': ' + message);
};