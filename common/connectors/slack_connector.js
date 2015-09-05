var https 		= require('https');
var _				= require('underscore');

function SlackConnector(token){
	this.token = token;
}
SlackConnector.prototype.requestToken = function(code, callback){
	var fullURL = "/api/oauth.access?client_id=2345135970.9201204242&redirect_uri=http://team.swipesapp.com/slacksuccess/&client_secret=306fd7099a762968aa876d53579fa694&code="+code;
	var options = {
		method: "POST",
		host: "slack.com",
		path: fullURL,
		headers: { 'Content-Type': 'application/json' }
	};
	try {
		console.log("requesting token");
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			var output = '';
			res.on('data', function (chunk) {
				output += chunk;
			});
			res.on('end', function() {
	            var jsonObject = JSON.parse(output);
				callback(jsonObject);
	        });
		});
		req.end();
	}
	catch(err) {
		callback(false, err);
	}
}
SlackConnector.prototype.request = function(path, params, callback){
	var fullURL = "/api/" + path + "?token="+this.token;
	for(var key in params){
		fullURL += "&" + key + "=" + params[key];
	}
	var options = {
		method: "POST",
		host: "slack.com",
		path: fullURL,
		headers: { 'Content-Type': 'application/json' }
	};
	try {
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			var output = '';
			res.on('data', function (chunk) {
				output += chunk;
			});
			res.on('end', function() {
	            var jsonObject = JSON.parse(output);
				callback(jsonObject);
	        });
		});
		req.end();
	}
	catch(err) {
		callback(false, err);
	}
}
SlackConnector.prototype.postAsSofi = function(channel, message, callback){
	var path = "chat.postMessage";
	var params = {
		"channel": channel,
		"as_user": false,
		"username": "s.o.f.i",
		"link_names": 1,
		"icon_url" : "http://team.swipesapp.com/styles/img/sofi48.jpg",
		"text": message
	};
	this.request(path, params, callback);
}

module.exports = SlackConnector;
