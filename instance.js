require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    http    =       require( 'http' ),
    bodyParser =    require( 'body-parser' ),
    toobusy =       require( 'toobusy' ),
    _ =             require( 'underscore' );
var Parse = require('parse').Parse;
var keys = require('./utilities/keys.js');
http.globalAgent.maxSockets = 25;
var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  } 
});
app.use(function(req, res, next) {
  var allowedHost = [ 
    "*" 
  ]; 

  if(allowedHost.indexOf("*") !==-1 || allowedHost.indexOf(req.headers.origin) !== -1) { 
    res.header('Access-Control-Allow-Credentials', true); 
    res.header('Access-Control-Allow-Origin', req.headers.origin);
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
var Logger =          require( './utilities/logger.js' );
var PGHandler = require( './postgres/pg_handler.js' );
var ParseHandler =    require( './parse/parse_handler.js' );
var PGClient =        require('./postgres/pg_client.js');

function sendBackError( error, res, logs ){
  var sendError = {code:141,message:'Server error' };
  if ( logs ) 
    sendError.logs = logs;
  if ( error && error.code ) 
    sendError.code = error.code;
  if ( error && error.message ) 
    sendError.message = error.message;
        
  res.send( sendError );
}

app.route( '/v1/sync' ).post( handleSync );
app.route( '/sync' ).post( handleSync );

app.route('/test').get(function(req,res){
  var logger = new Logger();
  var client = new PGClient();
  var pgHandler = new PGHandler( client, logger );
  pgHandler.test(function(result,error){
    res.send(result);
  })
});

app.route('/trial').get(function(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
  if ( !req.query.user )
    return res.jsonp({code:142,message:"user must be included"});

  var parseHandler = new ParseHandler();
  parseHandler.trial( req.query.user , function( result , error ){
    if ( error )
      res.jsonp( error );
    else 
      res.jsonp( result );

  });
});

function handleSync( req, res, next ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );
  var versionNumber = ( req.path == '/sync' ) ? 0 : 1;
  //res.setHeader( 'Content-Type' , 'application/json' );
  var logger = new Logger();
  var client = new PGClient( logger );
  client.validateToken( req.body.sessionToken , versionNumber , function( userId, error){
    // TODO: send proper error back that fits clients handling
    if ( error )
      return sendBackError( error , res);
    logger.time( 'credential validation completed' );
    logger.setIdentifier( userId );

    var handler;
    if ( versionNumber ){
      var handler = new PGHandler( client , logger );
      if ( req.body.hasMoreToSave )
        handler.hasMoreToSave = true;
      if ( req.body.batchSize )
        handler.batchSize = req.body.batchSize;
    }
    else{
      handler = new ParseHandler( logger );
    }
    
    
    handler.sync( req.body, userId, function( result , error ){
      logger.time('Finished request', true);
      if ( result ){
        if ( req.body.sendLogs ) 
          result['logs'] = logger.logs;
        res.send( result );
      }
      else{
        logger.sendErrorLogToParse( error, req.body );
        sendBackError( error , res, logger.logs );
      }

    });
  });
};



var port = Number(process.env.PORT || 5000);
var server = app.listen(port);

process.on('SIGINT', function() {
  server.close();
  // calling .shutdown allows your process to exit normally
  toobusy.shutdown();
  process.exit();
});