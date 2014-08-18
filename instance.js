//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    http    =       require( 'http' ),
    bodyParser =    require( 'body-parser' ),
    _ =             require( 'underscore' );
var Parse = require('parse').Parse;
var keys = require('./utilities/keys.js');
http.globalAgent.maxSockets = 25;
var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
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
  if ( error && error.hardSync )
    sendError.hardSync = true;
        
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

app.route('/vero').post( function(req,res){
  var Vero = require('./utilities/vero').EventLogger;
  var authToken = "YmU3ZGNlMTBhOTAzZTJlMjRhMTJkZjFjODYyODE2YzZmZWFkMmRmNzphZmZiNjI1YWQ4YzY3YTU1NDA3Nzk4ZTZjMWY4OWZjNTAyZjU1NTQ4"; // = process.env['VERO_TOKEN'];
  var devMode = false; // false in PRODN
  var veroLogger = new Vero(authToken, devMode);

  var identifier = req.body.identifier;
  var email = req.body.email;
  var identity = { id: identifier, email: email };
  var eventName = req.body.eventName;
  var eventData = req.body.eventData;
  if(!eventData)
    eventData = {};
  veroLogger.addEvent(identity, eventName, eventData, function (err, localRes, body) {
    if (err) res.jsonp( err );
    else res.jsonp( body );
  });
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
  if(versionNumber == 0){
    sendBackError({ code: 123, message: "update required" }, res );
    return;
  }
  sendBackError({code: 504, message: "maintainence"}, res);
  return;
  var logger = new Logger();
  var client = new PGClient( logger );

  client.validateToken( req.body.sessionToken , versionNumber , function( userId, error){
    // TODO: send proper error back that fits clients handling
    if ( error ){
      client.end();
      return sendBackError( error , res);
    }
    logger.time( 'credential validation completed' );
    logger.setIdentifier( userId );

    var handler;
    if ( versionNumber ){
      var handler = new PGHandler( client , logger );
      if ( req.body.hasMoreToSave )
        handler.hasMoreToSave = true;
    }
    else{
      handler = new ParseHandler( logger );
    }
    
    
    handler.sync( req.body, userId, function( result , error ){
      client.end();
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
app.listen(port);