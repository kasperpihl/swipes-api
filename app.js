//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    bodyParser =    require( 'body-parser' ),
    _ =             require( 'underscore' );
var Parse = require('parse').Parse;
var keys = require('./utilities/keys.js');
var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );

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
  console.log('test');
  res.send("test");
  return;
  var pgHandler = new PGHandler( client, logger );
  pgHandler.test(function(result,error){
    res.send(result);
  })
});

app.route('/trial').get(function(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
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

function handleSync( req, res ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var versionNumber = ( req.path == '/sync' ) ? 0 : 1;
  //res.setHeader( 'Content-Type' , 'application/json' );
  var logger = new Logger();
  var client = new PGClient( logger );
  console.log('started request');
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
app.listen(port);