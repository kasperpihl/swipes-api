"use strict";

// ===========================================================================================================
// Setup
// ===========================================================================================================
let config = require('config');
let PORT = Number(config.get('apiPort') || 5000);

let express = require( 'express' );
let app = express();
let server = app.listen(PORT);
let io = require('socket.io').listen(server);
let jwt = require('jwt-simple');
let cors = require('cors');
let bodyParser = require( 'body-parser' );
let _ = require( 'underscore' );
let util = require('./util.js');
let jwtMiddleware = require('./jwt-auth-middleware.js');
let swipesErrMiddleware = require('./swipes-err-middleware.js');

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With'
}));
app.use('/workflows', express.static(__dirname + '/../workflows'));

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
//let appsRouter = require('./routes/apps.js');
let usersAuth = require('./routes/users_auth.js');
let usersRouter = require('./routes/users.js');
let rtmRouter = require('./routes/rtm.js');
let sdkRouter = require('./routes/sdk.js');
let searchRouter = require('./routes/search.js');
let servicesRouter = require('./routes/services.js');
let servicesNoAuthRouter = require('./routes/services_no_auth.js');
let mentionsRouter = require('./routes/mentions.js');
let organizationsRouter = require('./routes/organizations.js');
let workflowsRouter = require('./routes/workflows.js');
let linksRouter = require('./routes/links.js');

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
app.use('/v1', sdkRouter);
app.use('/v1', servicesNoAuthRouter);

// Middleware to check if a valid token is provided from the user
app.use('/v1', jwtMiddleware.restAuth);

// Routes for which we need authentication
//app.use('/v1', appsRouter);
app.use('/v1', usersRouter);
app.use('/v1', rtmRouter);
app.use('/v1', searchRouter);
app.use('/v1', servicesRouter);
app.use('/v1', mentionsRouter);
app.use('/v1', organizationsRouter);
app.use('/v1', workflowsRouter);
app.use('/v1', linksRouter);

// We want req.userId to the socket.io stuff too
io.use((socket, next) => {
  jwtMiddleware.ioAuth(socket.request, socket.request.res, next);
})

// require our socketio module and pass the io instance
require('./socketio/socketio.js')(io);

// ===========================================================================================================
// Error handlers / they should be at the end of the middleware stack
// ===========================================================================================================

let logErrors = (err, req, res, next) => {
  // We can use some service like loggy to log errors
  if (err) {
    console.error(err.stack);
    next(err);
  } else {
    next();
  }
}

let unhandledServerError = (err, req, res, next) => {
  if(err){
    console.log(err);
  	//res.status(500).send({ err: 'Something blew up! Sorry :/ We will call the dinosaurs from Swipes to fix the problem.' });
    res.status(500).send({ err: err });
  }
  else
  	next()
}

app.use(swipesErrMiddleware);
app.use(logErrors);
app.use(unhandledServerError);

console.log('server started on port %s', PORT);
