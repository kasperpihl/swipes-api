"use strict";
let express = require( 'express' );
let router = express.Router(); 

let appDir = __dirname + '/../../apps/';
let fs = require('fs');
let getAppFile = (appId, fileName) => {
  let file;

  try {
    let dest = appDir + appId + '/' + fileName;

    file = fs.readFileSync(dest, 'utf8');
  } catch (err) {
    console.log(err);
    file = null;
  }

  return file;
}


router.get('/sdk.load', (req, res, next) => {
	let appId = req.query.app_id;
	let manifestId = req.query.manifest_id;
	let manifest = JSON.parse(getAppFile(manifestId, 'manifest.json'));


	// TODO: Do validations and stuff
	if (!manifest) {
		return res.status(200).json({ok: false, err: 'no_manifest_found'});
	}

	let apiHost = 'http://' + req.headers.host;
	let appUrlDir = apiHost + '/apps/' + manifestId;
	let _defUrlDir = apiHost + '/apps/app-loader/';
	// Insert dependencies, SwipesSDK and other scripts right after head
	let insertString = '';
	
	function wrap(text){
		return 'document.write(\'' + text + '\');\r\n';
	}

	// Temporary solution, server shouldn't include them, they should be packed together
	insertString += getAppFile('app-loader', 'jquery.min.js');
	insertString += getAppFile('app-loader', 'socket.io.js');
	insertString += getAppFile('app-loader', 'underscore.min.js');
	insertString += getAppFile('app-loader', 'q.min.js');
	insertString += getAppFile('app-loader', 'swipes-api-connector.js');
	insertString += getAppFile('app-loader', 'swipes-app-sdk.js');
	insertString += getAppFile('app-loader', 'swipes-ui-kit/ui-kit-main.js');
	insertString += wrap('<link type="text/css" rel="stylesheet" href="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.css" />');
	insertString += 'window.swipes = new SwipesAppSDK("' + apiHost + '");';


	// Instantiate objects and add runtime stuff
	if(req.query.token){
		insertString += 'swipes.setToken("' + req.query.token + '");';
	}

	// If apps load sends the referer, use it for parent
	var referer = req.query.referer ? req.query.referer : 'test';
	insertString += 'if(parent) swipes._client.setListener(parent, "' + referer + '");';
	insertString += 'if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.api) swipes._client.setListener(window.webkit.messageHandlers.api, "' + req.headers.referer + '");';
	insertString += 'swipes._client.setAppId("' + manifestId + '");';
	insertString += 'swipes.info.manifest = ' + JSON.stringify(manifest) + ';';
	if(req.userId)
		insertString += 'swipes.info.userId = "' + req.userId + '";';

/*
	
	insertString += wrap('<script src="' + _defUrlDir + 'jquery.min.js"></script>"');
	insertString += wrap('<script src="' + _defUrlDir + 'underscore.min.js"></script>');
	insertString += wrap('<script src="' + _defUrlDir + 'q.min.js"></script>');
	insertString += wrap('<script src="' + _defUrlDir + 'swipes-api-connector.js"></script>');
	insertString += wrap('<script src="' + _defUrlDir + 'swipes-app-sdk.js"></script>');
	
	insertString += wrap('<script src="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.js"></script>');

	insertString += wrap('<script>');
	
	insertString += wrap('</script>'); */
	res.setHeader('Content-Type', 'application/javascript');
	res.send(insertString);
});

module.exports = router;