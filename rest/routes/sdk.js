"use strict";
let express = require( 'express' );
let router = express.Router();
let fs = require('fs');
let util = require('../util.js');

let appDir = __dirname + '/../../apps/';

router.get('/sdk.load', (req, res, next) => {
	let apiHost = 'http://' + req.headers.host;

	let _defUrlDir = apiHost + '/apps/app-loader/';
	// Insert dependencies, SwipesSDK and other scripts right after head
	let insertString = '';

	function wrap(text){
		return 'document.write(\'' + text + '\');\r\n';
	}

	// Temporary solution, server shouldn't include them, they should be packed together
	insertString += util.getAppFile(appDir + 'app-loader' + '/jquery.min.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/socket.io.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/underscore.min.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/q.min.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/swipes-api-connector.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/swipes-app-sdk.js');
	insertString += util.getAppFile(appDir + 'app-loader' + '/swipes-ui-kit/ui-kit-main.js');
	insertString += wrap('<link type="text/css" rel="stylesheet" href="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.css" />');
	insertString += 'window.swipes = new SwipesAppSDK("' + apiHost + '");';


	// Instantiate objects and add runtime stuff

	// If apps load sends the referer, use it for parent
	insertString += 'if(parent) swipes._client.setListener(parent);';
	insertString += 'if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) swipes._client.setListener(window.webkit.messageHandlers.api);';


	res.setHeader('Content-Type', 'application/javascript');
	res.send(insertString);
});

module.exports = router;
