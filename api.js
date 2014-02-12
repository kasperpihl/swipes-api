var express = require('express');
var app = express();

app.use(express.json());
var parse = require('./server/parse.js');
var Parse = require('parse').Parse;
var _ = require('underscore');
var keys = require('./conf/keys.js');
var logger = require('./server/logger.js');
app.get('/clean',function(req, res){
	Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	var sessionToken = req.query.sessionToken;
	Parse.User.become(sessionToken).then(function(result){
		parse.clean(function(result,error){
			if(error)res.send(error);
			else res.send('success');
		});
	},function(error){ res.send(error); });
});
app.get('/removeDuplicates',function(req,res){
	/*Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	Parse.Cloud.useMasterKey();
	var userId = req.query.userId;
	parse.cleanDup(userId,function(result,error){
		if(error)res.send(error);
		else res.send({"message":result});
	});*/
});

app.post('/sync', function(req, res) {
	var startTime = new Date().getTime();
	Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	res.setHeader('Content-Type', 'application/json');
	if(!req.body.sessionToken){
		return res.send(142,{code:142,message:"sessionToken must be included"});
	}
	Parse.User.become(req.body.sessionToken).then(function(result){
		parse.sync(req.body,function(result,error){
			var endTime = new Date().getTime();
  			var time = endTime - startTime;
  			logger.log('Finished request in (' + time + " ms)");
			if(result) res.send(result);
			else{
				var sendError = {code:141,message:'Server error'};
				if(error && error.code) sendError.code = error.code;
				if(error && error.message) sendError.message = error.message;
				res.send(sendError.code,sendError);
			}
		});
	},function(error){ res.send(400,error); });
});
var port = Number(process.env.PORT || 5000);
app.listen(port);