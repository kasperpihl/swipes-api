// ===========================================================================================================
// Setup
// ===========================================================================================================

var express =       require( 'express' ),
http    =       require( 'http' ),
bodyParser =    require( 'body-parser' ),
_ =             require( 'underscore' );

var APIController = require('./controllers/api_controller.js');
var WebhookController = require('./controllers/webhook_controller.js');

http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
});

// ===========================================================================================================
// Middle ware to set headers enabling CORS
// ===========================================================================================================
// 
app.use(function(req, res, next) {
	var allowedHost = [
		"*"
	];
	if(allowedHost.indexOf("*") !==-1 || allowedHost.indexOf(req.headers.origin) !== -1) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers','X-Requested-With, Content-MD5,Content-Type');
		if ('OPTIONS' === req.method) {
			res.writeHead(204);
			res.end();
		}
		else {
			next();
		}
	}
	else next();
});

// ===========================================================================================================
// Routes
// ===========================================================================================================
app.route( '/').get( function(req,res,next){
	res.send("Swipes synchronization services - online");
});


// Sync Route
// =========================================================================================================    
app.route( '/v1/sync' ).post( function(req, res){ new APIController( req, res ).sync(); });


// Slack Token
// =========================================================================================================    
app.route( '/v1/slackToken' ).post( function(req, res){ new APIController( req, res ).verifySlackToken(); });


// Invite User
// =========================================================================================================
app.route( '/v1/invite/slack' ).post( function(req, res){ new APIController( req, res ).inviteSlackUser(); });
app.route( '/v1/invite/slack').get( function(req, res){ new APIController( req, res ).getInvitedUsers(); });

// Auth Route - to send auth data for integrations
// =========================================================================================================
app.route( '/v1/auth' ).post( function( req, res){ new APIController( req, res ).auth(); });
	

// Auth Route - to send auth data for integrations
// =========================================================================================================
app.route( '/v1/mailbox' ).post( function( req, res){ new APIController( req, res ).addMailbox(); });


// ===========================================================================================================
// Webhooks
// ===========================================================================================================


	// Context IO Webhook
	// =========================================================================================================

app.route( 'v1/webhooks/contextio' ).post( function( req, res){ new WebhookController( req, res ).contextIO(); });


// ===========================================================================================================
// Start the server 
// ===========================================================================================================


var port = Number(process.env.PORT || 5000);
app.listen(port);