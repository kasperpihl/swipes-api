"use strict";

// ===========================================================================================================
// Setup
// ===========================================================================================================
let PORT = Number(process.env.PORT || 5000);

let express = require( 'express' );
let app = express();

let server = app.listen(PORT);
let io = require('socket.io').listen(server);
let cors = require('cors');
let bodyParser = require( 'body-parser' );
let _ = require( 'underscore' );
let cookieParser = require('cookie-parser');
let session = require('express-session');
let util = require('./util.js');
let config = require('config');

let sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  secret: 'swipy the dinocat'
})

app.use(cookieParser());

// When socket-io documentation sux you go to stackoverflow
// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
})

app.use(sessionMiddleware);

app.use(cors({
  origin: config.get('origin'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Authorization, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  credentials: true
}));
app.use('/apps', express.static(__dirname + '/../apps'));

app.use(bodyParser.json( { limit: 3000000 } ) );
let parseErrorHandler = (err, req, res, next) => {
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
let usersAuth = require('./routes/users_auth.js');
let usersRouter = require('./routes/users.js');
let channelsRouter = require('./routes/channels.js');
let tasksRouter = require('./routes/tasks.js');
let rtmRouter = require('./routes/rtm.js');
let chatRouter = require('./routes/chat.js');
let imRouter = require('./routes/im.js');

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', (err) => {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
});

// ===========================================================================================================
// Routes
// ===========================================================================================================

app.route('/').get((req,res,next) => {
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
app.use('/v1', imRouter);

// require our socketio module and pass the io instance
require('./socketio/socketio.js')(io);

// ===========================================================================================================
// Error handlers / they should be at the end of the middleware stack
// ===========================================================================================================

let logErrors = (err, req, res, next) => {
  // We can use some service like loggy to log errors
  console.error(err.stack);
  next(err);
}

let unhandledServerError = (err, req, res, next) => {
  if(err)
  	res.status(500).send({ error: 'Something blew up! Sorry :/ We will call the dinosaurs from Swipes to fix the problem.' });
  else
  	next()
}

app.use(logErrors);
app.use(unhandledServerError);

console.log('server started on port %s', PORT);
