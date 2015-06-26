var ContextIO 		= require('contextio');
var Q				= require('q');
var _				= require('underscore');

function ContextIOConnector(){
	this.client = new ContextIO.Client({
		key: "vavr703o",
		secret: "yDVpsVqUPceDbbXW"
	});
}

ContextIOConnector.prototype.addMailbox = function(contextUserId, callback){
	this.client.connect_tokens.post({}, function( err, response){
		if(err)
			callback(false, err);
		else
			callback(response);
	});
}

module.exports = ContextIOConnector;
