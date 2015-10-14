// ===========================================================================================================
// Setup
// ===========================================================================================================

var express = require( 'express' );
var http = require( 'http' );
var bodyParser = require( 'body-parser' );
var _ = require( 'underscore' );

http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
function parseErrorHandler(err, req, res, next) {
  if(err) {
  	res.status(400).send({ error: 'Invalid json.' });
  } else {
  	next()
  }
}
app.use(parseErrorHandler);

// ===========================================================================================================
// Require routes
// ===========================================================================================================
var usersRouter = require('./routes/users.js');
var channelsRouter = require('./routes/channels.js');
var tasksRouter = require('./routes/tasks.js');

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
});

// ===========================================================================================================
// Middleware to set headers enabling CORS
// ===========================================================================================================
app.use(function(req, res, next) {
	var allowedHost = [
		'*'
	];
	if(allowedHost.indexOf('*') !==-1 || allowedHost.indexOf(req.headers.origin) !== -1) {
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
	res.send('Swipes synchronization services - online');
});

app.use('/v1', usersRouter);
app.use('/v1', channelsRouter);
app.use('/v1', tasksRouter);

// ===========================================================================================================
// Error handlers / they should be at the end of the middleware stack
// ===========================================================================================================

function logErrors(err, req, res, next) {
  // We can use some service like loggy to log errors
  console.error(err.stack);
  next(err);
}

function unhandledServerError(err, req, res, next) {
  if(err)
  	res.status(500).send({ error: 'Something blew up! Sorry :/ We will call the dinosaurs from Swipes to fix the problem.' });
  else
  	next()
}

app.use(logErrors);
app.use(unhandledServerError);


// ===========================================================================================================
// Start the server
// ===========================================================================================================

var PORT = Number(process.env.PORT || 5000);
app.listen(PORT);
console.log('server started on port %s', PORT);
