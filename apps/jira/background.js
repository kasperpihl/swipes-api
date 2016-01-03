"use strict";
var JiraClient = require('jira-connector');
let background = {};
let util = require('../../rest/util.js');
background.methods = {
	search: (query, callback) => {
		if (!query || typeof query !== 'string') {
			callback(new Error("Query should be a string!"));
		}

		let escapedQuery = util.escapeRegExp(query);
		var jira = new JiraClient( {
			host: 'swipes.atlassian.net',
			basic_auth: {
				username: process.env.JIRA_USER,
				password: process.env.JIRA_PASSWORD
			}
		});

		var searchString = '(summary~"' + escapedQuery + '\\u002a" OR description~"' + escapedQuery + '\\u002a")';
		jira.search.search({jql: searchString, fields: ['id','key', 'summary'], maxResults: 5}, function(err, result){
			if(!err){
				var returnArr = [];
				for(var i = 0 ; i < result.issues.length ; i++){
					var issue = result.issues[i];
					var simpleIssue = {
						id: issue.id,
						text: issue.key + ": " + issue.fields.summary
					}
					returnArr.push(simpleIssue);    

				}
				callback(returnArr);
			}
			else
				callback([]);
		});
	}
};

module.exports = background;
