var express = require('express');
var app = express();

app.use(express.json());
var parse = require('./server/parse.js');
var Parse = require('parse').Parse;
var _ = require('underscore');
var keys = require('./conf/keys.js');
var logger = require('./server/logger.js');

app.get('/trial',function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	if(!req.query.user)
		return res.jsonp({code:142,message:"user must be included"});
	parse.trial(req.query.user,function(result,error){
		if(error)res.jsonp(error);
		else res.jsonp(result);
	});
});

app.post('/sync', function(req, res) {
	var startTime = new Date().getTime();
	Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	res.setHeader('Content-Type', 'application/json');
	
	if(!req.body.sessionToken){
		return res.send({code:142,message:"sessionToken must be included"});
	}
	Parse.User.become(req.body.sessionToken).then(function(result){
		logger.log('Started request');
		parse.sync(req.body,function(result,error){
			var endTime = new Date().getTime();
  			var time = endTime - startTime;
  			logger.log('Finished request in (' + time + " ms)");
			if(result) res.send(result);
			else{
				logger.log('Error from return ' + error,true);
				var sendError = {code:141,message:'Server error'};
				if(error && error.code) sendError.code = error.code;
				if(error && error.message) sendError.message = error.message;
				res.send(sendError);
			}
		});
	},function(error){ res.send(error); });
});
var port = Number(process.env.PORT || 5000);
app.listen(port);