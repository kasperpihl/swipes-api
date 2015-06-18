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

/*
app.route( '/move' ).get( function( req, res ){
	Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

	var logger = new Logger();
	var client = new PGClient( logger );
	if ( !req.query.from)
		return res.jsonp({code:142,message:"from must be specified"});
	var users = { "test": "qm6FIHpYQX", "felipe": "b4mooVKc4f", "stanimir": "ONaP54dxAu", "kasper": "3TMYzCDo6u", "none": "none"};


	var to, from = req.query.from;
	if(users[from])
		from = users[from];

	if ( req.query.to && users[req.query.to] ){
		to = users[req.query.to];
	}
	else
		return res.jsonp({code:142,message:"'to' must be defined (firstName)"});

	var moveController = new MoveController( client, logger );
	moveController.copyDataFromUserToUser( from, to, function(results, error){
		//console.log(results);
		if(error){
			res.jsonp(error);
		}
		else{
			res.jsonp({"status":"success"});
		}
	});
	return ;
});
*/

// ===========================================================================================================
// Start the server 
// ===========================================================================================================


var port = Number(process.env.PORT || 5000);
app.listen(port);