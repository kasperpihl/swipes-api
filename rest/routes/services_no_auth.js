"use strict";

let express = require( 'express' );
let router = express.Router();

// Work around for the stupid jira
// we can't set a url like http://localhost:3000/oauth-success.html
// because they put `/` behind it...
// maybe there is a smarter way around this
router.get('/services.authsuccess', (req, res, next) => {
  let oauthToken = 'oauth_token=' + req.query.oauth_token + '&';
  let oauthVerifier = 'oauth_token=' + req.query.oauth_verifier;

  return res.redirect('http://localhost:3000/oauth-success.html?' + oauthToken + oauthVerifier);
});

module.exports = router;
