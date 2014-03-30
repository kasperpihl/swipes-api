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
	Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
	Parse.Cloud.useMasterKey();
	var userId = req.query.userId;
	parse.cleanDup(userId,function(result,error){
		if(error)res.send(error);
		else res.send({"message":result});
	});
});
var port = Number(process.env.PORT || 5000);
app.listen(port);