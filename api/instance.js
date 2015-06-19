//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");

// ===========================================================================================================
// Setup
// ===========================================================================================================

var express =       require( 'express' ),
http    =       require( 'http' ),
bodyParser =    require( 'body-parser' ),
_ =             require( 'underscore' );

var APIController = require('./controllers/api_controller.js');
http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );


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


	// Main Route
	// =========================================================================================================

app.route( '/').get( function(req,res,next){
	res.send("Swipes synchronization services - online");
});

	// Sync Route
	// =========================================================================================================    

app.route( '/v1/sync' ).post( function(req, res){ new APIController( req, res ).sync(); });




// ===========================================================================================================
// Start the server 
// ===========================================================================================================


var port = Number(process.env.PORT || 5000);
app.listen(port);