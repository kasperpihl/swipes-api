//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    http    =       require( 'http' ),
    bodyParser =    require( 'body-parser' ),
    _ =             require( 'underscore' ),
    crypto    = require('crypto');
var Parse = require('parse').Parse;
var keys = require('./utilities/keys.js');
http.globalAgent.maxSockets = 25;

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

function getIntercomHmac( userId ){
  var key       = 'wHegdJq173o6E3oYkEZ8l2snIKzzY5tgjV_r8CLL';
  var algorithm = 'sha256';
  var hash, hmac;

  hmac = crypto.createHmac(algorithm, key);

  // change to 'binary' if you want a binary digest
  hmac.setEncoding('hex');

  // write in the text that you want the hmac digest for
  hmac.write(userId);

  // you can't read from the stream until you call end()
  hmac.end();

  // read out hmac digest
  hash = hmac.read(); 
  return hash;
}

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
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

var Logger =          require( './utilities/logger.js' );
var PGHandler = require( './postgres/pg_handler.js' );
var ParseHandler =    require( './parse/parse_handler.js' );
var PGClient =        require('./postgres/pg_client.js');
var MoveController =  require('./admin/move_controller.js');
var FetchController = require('./admin/fetch_controller.js');


app.route( '/v1/sync' ).post( handleSync );
app.route( '/sync' ).post( handleSync );
app.route( '/v1/add').post( handleAdd );
app.route('/test').get(function(req,res,next){
  var logger = new Logger();
  var client = new PGClient();
  var pgHandler = new PGHandler( client, logger );
  pgHandler.test(function(result,error){
    res.send(result);
  })
});
app.route( '/hmac').post( function( req, res){
  if(!req.body.identifier)
    return res.jsonp({code:142, message: "identifier must be defined"});
  if(!_.isString(req.body.identifier))
    return res.jsonp({code:142, message: "identifier must be string"});
  if(req.body.identifier.indexOf("test-") != 0)
    return res.jsonp({code:142, message: "identifier must start with test-"})
  res.jsonp({"intercom-hmac":getIntercomHmac(req.body.identifier)});
});
app.route( '/move' ).get( function( req, res ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var logger = new Logger();
  var client = new PGClient( logger );
  if ( !req.query.from)
    return res.jsonp({code:142,message:"from must be specified"});
  var users = { "test": "qm6FIHpYQX", "felipe": "b4mooVKc4f", "stanimir": "ONaP54dxAu", "kasper": "3TMYzCDo6u"};


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

function handleAdd( req, res, next){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );
  var logger = new Logger();
  var client = new PGClient( logger, 12000 );

  client.validateToken( req.body.sessionToken , false, function( userId, error){
    // TODO: send proper error back that fits clients handling
    if ( error ){
      client.end();
      return sendBackError( error , res);
    }
    logger.setIdentifier( userId );

    var handler = new PGHandler( client , logger );
    
    handler.add( req.body, userId, function( result , error ){
      logger.time('Finished request', true);
      if(client.timedout){
        sendBackError( {code:510, message:"Request Timed Out"} , res, logger.logs );
        return;
      }
      client.end();
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

function handleSync( req, res, next ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );
  var versionNumber = ( req.path == '/sync' ) ? 0 : 1;
  //res.setHeader( 'Content-Type' , 'application/json' );
  if(versionNumber == 0){
    sendBackError({ code: 123, message: "update required" }, res );
    return;
  }

  var logger = new Logger();
  var client = new PGClient( logger, 12000 );

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
      logger.time('Finished request', true);
      if(client.timedout){
        sendBackError( {code:510, message:"Request Timed Out"} , res, logger.logs );
        return;
      }
      client.end();
      if ( result ){
        if ( req.body.sendLogs ){
          result['logs'] = logger.logs;
        }

        result['intercom-hmac'] = getIntercomHmac(userId);
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