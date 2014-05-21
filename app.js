var express =       require( 'express' ),
    bodyParser =    require( 'body-parser' ),
    _ =             require( 'underscore' );

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );

var Logger =          require( './utilities/logger.js' );
var PGHandler = require( './postgres/pg_handler.js' );
var ParseHandler =    require( './parse/parse_handler.js' );
var PGClient =        require('./postgres/pg_client.js');

app.route('/test').get(function(req,res){
  var logger = new Logger();
  var client = new PGClient();
  var pgHandler = new PGHandler( client, logger );
  pgHandler.test(function(result,error){
    res.send(result);
  })
});


app.route( '/v1/sync' ).post( function( req, res ) {
  
  res.setHeader( 'Content-Type' , 'application/json' );
  
  var logger = new Logger();
  var client = new PGClient( logger );
  
  client.validateToken( req.body.sessionToken , true , function( userId, error){
    // TODO: send proper error back that fits clients handling
    if ( error )
      return res.send( error );
    
    logger.time( 'credential validation completed' );
    logger.setIdentifier( userId );
    var pgHandler = new PGHandler( client , logger );
    if ( req.body.hasMoreToSave )
      pgHandler.hasMoreToSave = true;
    if ( req.body.batchSize )
      pgHandler.batchSize = req.body.batchSize;
    
    pgHandler.sync( req.body, userId, function( result , error ){

      logger.time('Finished request', true);
      result['logs'] = logger.logs;
      if ( result ) 
        res.send( result );
      else{

        var reqBody = JSON.stringify(req.body);
        var sendError = {code:141,message:'Server error' , logs: logger.logs, reqBody:reqBody };
        if ( error && error.code ) 
          sendError.code = error.code;
        if ( error && error.message ) 
          sendError.message = error.message;
        
        res.send( sendError );
      }

    });
  });
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

app.route('/sync').post(function(req, res) {
  Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
  res.setHeader('Content-Type', 'application/json');

  if ( !req.body.sessionToken ){
    return res.send({code:142,message:"sessionToken must be included"});
  }

  var logger = new Logger();
  var parseHandler = new ParseHandler( logger );
  
  Parse.User.become( req.body.sessionToken ).then( function( user ){
    
    logger.time( 'Started request' );
    logger.setIdentifier( user.id );
    
    parseHandler.sync(req.body, user, function( result , error ){

      logger.time('Finished request',true);
      
      if ( result ) 
        res.send( result );
      else{

        logger.log('Error from return ' + error,true);
        
        var sendError = {code:141,message:'Server error'};
        
        if ( error && error.code ) 
          sendError.code = error.code;
        if ( error && error.message ) 
          sendError.message = error.message;
        
        res.send( sendError );
      }
    });
  },function(error){ 
    res.send(error); 
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port);