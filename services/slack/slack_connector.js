var https 		= require('https');
var _			= require('underscore');
var SlackConnector = {};
SlackConnector.request = function(token, path, params, callback){
	var fullURL = "/api/" + path;
	var sign = '?'
	if(typeof params === 'object'){
		for(var key in params){
			fullURL += sign + key + "=" + params[key];
			sign = '&';
		}
	}
	if(token){
		fullURL += sign + "token" + "=" + token;
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
				if(res.statusCode !== 200){
					return callback(output);
				}
	            var jsonObject = JSON.parse(output);
	            if(jsonObject.ok)
					callback(null, jsonObject);
				else
					callback(jsonObject.error);
	        });
		});
		req.on('error', function(err){
			callback(err);
		});
		req.end();
	}
	catch(err) {
		callback(err);
	}
}

module.exports = SlackConnector;
