"use strict";
let express = require( 'express' );
let router = express.Router();
let fs = require('fs');
let util = require('../util.js');

let workflowDir = __dirname + '/../../workflows/';

router.get('/sdk.worker.load', (req, res, next) => {
	let apiUrl = 'http://' + req.headers.host;

	let _defUrlDir = apiUrl + '/workflows/app-loader/';
	// Insert dependencies, SwipesSDK and other scripts right after head
	let insertString = '';

	function wrap(text){
		return 'document.write(\'' + text + '\');\r\n';
	}

	// Temporary solution, server shouldn't include them, they should be packed together
	insertString += util.getFile(workflowDir + 'app-loader' + '/q.min.js');
	insertString += util.getFile(workflowDir + 'app-loader' + '/swipes-api-connector.js');
	insertString += util.getFile(workflowDir + 'app-loader' + '/swipes-app-sdk.js');
	insertString += 'var window = this; var swipes = new SwipesAppSDK("' + apiUrl + '");';


	// Instantiate objects and add runtime stuff

	// If apps load sends the referer, use it for parent
	insertString += 'if(typeof this.postMessage === "function") swipes._client.setListener(this);';

	res.setHeader('Content-Type', 'application/javascript');
	res.send(insertString);
});

module.exports = router;
