var https 		= require('https');
var _			= require('underscore');
var SlackConnector = {};
SlackConnector.request = function(path, params, callback){
	var fullURL = "/api/" + path;
	var sign = '?'
	for(var key in params){
		fullURL += sign + key + "=" + params[key];
		sign = '&';
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
	            if(jsonObject.ok)
					callback(null, jsonObject);
				else
					callback(jsonObject.error);
	        });
		});
		req.end();
	}
	catch(err) {
		callback(err);
	}
}

module.exports = SlackConnector;
