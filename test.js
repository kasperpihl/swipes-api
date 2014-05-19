var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var parse = require('./parse/parse_handler.js');
var Parse = require('parse').Parse;
var _ = require('underscore');
var keys = require('./conf/keys.js');
var logger = require('./utilities/logger.js');

var LoadTests = require('./tests/load_tests.js');

app.route( '/loadTest' ).get( function( req, res ){
	var loadTests = new LoadTests();
	loadTests.populateDatabaseWithObjects(function(result,error){
		if( error )
			res.send(error);
		else res.send( result);
	});
});

app.route( '/stats').get( function( req, res ){
	var loadTests = new LoadTests();

	loadTests.getStats(function(result,error){
		if( error )
			res.send(error);
		else res.send( result);
	});
});

/*
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
});*/
var port = Number(process.env.PORT || 5000);
app.listen(port);