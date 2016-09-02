"use strict";

let express = require( 'express' );
let config = require('config');
let serviceUtil = require('../utils/services_util.js');
let router = express.Router();
let SwipesError = require('../swipes-error.js');

/*
	Forward authorize request.
*/
router.get('/services.authorize', serviceUtil.getService, serviceUtil.requireService,  (req, res, next) => {
	let service = res.locals.service;
	let file = res.locals.file;

	if(typeof file.authorize !== 'function') {
		return next(new SwipesError('authorize_function_not_found'));
	}

	file.authorize({userId: req.userId}, (error, result) => {
		if (error) {
			return res.status(200).json({ok:false, err: error});
		}
		res.writeHead(302, {'Location': result.url});
       	res.end();
		//return res.status(200).json({ok: true, result: result});
	});
})

/*
  Work around for the stupid jira
  we can't set a url like http://localhost:3000/oauth-success.html
  because they put `/` behind it...
  So right know we redirect to our API, get the query parameters
  and redirect back to our oauth-success.html page
*/
router.get('/services.authsuccess', (req, res, next) => {
  let oauthToken = 'oauth_token=' + req.query.oauth_token + '&';
  let oauthVerifier = 'oauth_token=' + req.query.oauth_verifier;

  return res.redirect(config.get('origin') + ':' + config.get('clientPort') + '/oauth-success.html?' + oauthToken + oauthVerifier);
});

module.exports = router;
