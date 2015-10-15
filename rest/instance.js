// ===========================================================================================================
// Setup
// ===========================================================================================================

var express = require( 'express' );
var cors = require('cors');
var http = require( 'http' );
var bodyParser = require( 'body-parser' );
var _ = require( 'underscore' );
var cookieParser = require('cookie-parser');
var session = require('express-session');
var util = require('./util.js');

http.globalAgent.maxSockets = 25;

var app = express();

app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'swipy the dinocat'
}));

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
var usersAuth = require('./routes/users_auth.js');
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
// Routes
// ===========================================================================================================
app.route( '/').get( function(req,res,next){
	res.send('Swipes synchronization services - online');
});


// ===========================================================================================================
// Middleware for enabling cors for all /v1 routes
// Without preflight request. We will not use them for now.
// ===========================================================================================================
var corsOptions = {
  origin: 'http://localhost:9000',
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Authorization, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  credentials: true
}
app.use('/v1', cors(corsOptions));

// Routes for which we don't need authentication
app.use('/v1', usersAuth);

// Middleware to check if the user is logged
app.use('/v1', util.checkAuth);

// Routes for which we need authentication
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
