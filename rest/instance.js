// ===========================================================================================================
// Setup
// ===========================================================================================================

var COMMON = "../common/";
var express =       require( 'express' ),
	http    =       require( 'http' ),
	bodyParser =    require( 'body-parser' ),
	_ =             require( 'underscore' ),
	APIController = require('./api_controller.js');
var util = 				require(COMMON + 'utilities/util.js');

http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
//app.use(cookieParser());

// Catch any parsing errors, wrong json etc
app.use(function(err,req,res,next){
	if(err){
		util.sendBackError(err, res);
	}
	else
		next();
});

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
});

// ===========================================================================================================
// Middle ware to set headers enabling CORS
// ===========================================================================================================
app.use(function(req, res, next) {
	var allowedHost = [
		"*"
	];
	if(allowedHost.indexOf("*") !==-1 || allowedHost.indexOf(req.headers.origin) !== -1) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers','X-Requested-With, Content-MD5, Content-Type, Content-Length');

		if ('OPTIONS' === req.method) {
			res.sendStatus(200);
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

// Main Route
// =========================================================================================================
app.route( '/v1/:action' ).post( function(req, res){ new APIController().callAction(req.params.action, req, res); });
app.route( '/v1/:action' ).get( function(req, res){ new APIController().callAction(req.params.action, req, res); });


// ===========================================================================================================
// Start the server
// ===========================================================================================================

var PORT = Number(process.env.PORT || 5000);
app.listen(PORT);
console.log('server started on port %s', PORT);
