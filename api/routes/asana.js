var express = require( 'express' ),
	Asana = require('asana');

var router = express.Router();

// Create an Asana client. Do this per request since it keeps state that
// shouldn't be shared across requests.
function createClient() {
  return Asana.Client.create({
	// there should be some kind of conf file for things like this.
	// I don't like env vars when it is not for third party libs
    clientId: process.env.ASANA_CLIENT_ID,
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/v1/asana/asana_oauth'
  });
}

router.get("/asana_oauth", function (req, res) {
	var code = req.query.code;

	if (code) {
		// If we got a code back, then authorization succeeded.
		// Get token. Store it in the cookie and redirect home.
		var client = createClient();

		client.app.accessTokenFromCode(code).then(function(credentials) {
			res.cookie('token', credentials.access_token, { maxAge: 60 * 60 * 1000 });

			res.redirect('http://localhost:9000/');
		});
	} else {
		// T_TODO we have to handle errors better
		res.end('Error getting authorization: ' + req.param('error'));
	}
});

router.post("/asanaToken", function (req, res) {
	var client = createClient();
	// check the user for refresher token
	var token = req.cookies.token;

	if (token) {
		// Here's where we direct the client to use Oauth with the credentials
		// we have acquired.
		client.useOauth({ credentials: token });

		client.users.me().then(function(me) {
			res.redirect('/');
		}).catch(function(err) {
			// T_TODO handle errors better
			res.end('Error fetching user: ' + err);
		});
	} else {
		// Otherwise redirect to authorization.
		var asanaAuthorizeUrl = client.app.asanaAuthorizeUrl();

		// We don't use redirect here because it's not allowed for cross-origin requests that require preflight.
		res.status(200).json({asanaAuthorizeUrl: asanaAuthorizeUrl});
	}
});

module.exports = router;
