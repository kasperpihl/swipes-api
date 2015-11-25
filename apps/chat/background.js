var background = {};

background.beforeHandlers = {
	messages: function(data, callback){
		if(!data.ts){
			var threeRandom = ('000' + Math.random().toFixed(3)*1000).substr(-3);
			var ts = parseFloat(new Date().getTime() / 1000).toFixed(3) + threeRandom;
			data.ts = ts;
		}
		callback(data);
	}
};

background.afterHandlers = {
	messages: function(data, callback){
		console.log("after handler, do something after object is saved here");
		callback();
	}
};

background.methods = {
	start: function(data, callback){
		console.log("method run", data);
		callback("yeah")
	}
}

module.exports = background;