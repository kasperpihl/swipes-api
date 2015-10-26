// ===========================================================================================================
// Setup
// ===========================================================================================================
var PORT = Number(process.env.PORT || 5000);


var app = require( 'express' )();
var server = app.listen(PORT);
var io = require('socket.io').listen(server);
var cors = require('cors');
var bodyParser = require( 'body-parser' );
var _ = require( 'underscore' );
var cookieParser = require('cookie-parser');
var session = require('express-session');
var util = require('./util.js');

app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'swipy the dinocat'
}));

app.use(cors({
  origin: 'http://localhost:9000',
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Authorization, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  credentials: true
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
var rtmRouter = require('./routes/rtm.js');
var chatRouter = require('./routes/chat.js');

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

// Routes for which we don't need authentication
app.use('/v1', usersAuth);

// Middleware to check if the user is logged
app.use('/v1', util.checkAuth);

// Routes for which we need authentication
app.use('/v1', usersRouter);
app.use('/v1', channelsRouter);
app.use('/v1', tasksRouter);
app.use('/v1', rtmRouter);
app.use('/v1', chatRouter);

// require our socketio module and pass the io instance
require('./socketio/socketio.js')(io);

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

console.log('server started on port %s', PORT);
