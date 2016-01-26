var background = {};

background.beforeHandlers = {
	stanimir: function(data, callback){
		console.log("this is called before saving stanimir rows");
		callback(null, data);
	}
};

background.afterHandlers = {
	messages: function(data, old, callback){
		console.log("after handler, do something after object is saved here");
		callback();
	}
};

background.methods = {
	start: function(data, callback){
		console.log("method run", data);
		callback(null, "yeah");
	}
}

module.exports = background;
