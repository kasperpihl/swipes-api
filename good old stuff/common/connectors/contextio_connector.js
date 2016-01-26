var ContextIO 		= require('contextio');
var Q				= require('q');
var _				= require('underscore');

function ContextIOConnector(){
	this.client = new ContextIO.Client({
		key: "vavr703o",
		secret: "yDVpsVqUPceDbbXW"
	});
}

ContextIOConnector.prototype.addMailbox = function(callback_url, contextUserId, callback){
	if(!callback_url){
		return callback(false, "must include callback_url");
	}
	if(contextUserId)
		connector = this.client.accounts(contextUserId)
	else
		connector = this.client
	
	connector.connect_tokens().post({callback_url: callback_url}, function( err, response){
		if(err)
			callback(false, err);
		else
			callback(response);
	});
}

module.exports = ContextIOConnector;
