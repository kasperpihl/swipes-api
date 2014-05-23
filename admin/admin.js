var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var Parse = require('parse').Parse;
var keys = require('../utilities/keys.js');

var Logger =          require( '../utilities/logger.js' );
var PGClient =        require('../postgres/pg_client.js');
var MoveController =  require('./move_controller.js');

app.route( '/move' ).get( function( req, res ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var logger = new Logger();
  var client = new PGClient( logger );
  if ( !req.query.fromUser || !req.query.toUser )
    return res.jsonp({code:142,message:"fromUser and toUser must be specified"});

  var moveController = new MoveController( client, logger );
  moveController.copyDataFromUserToUser( req.query.fromUser, req.query.toUser, function( result, error ){
    res.jsonp( result );
  });
return ;

  client.validateToken( req.body.sessionToken , true , function( userId, error){
    // TODO: send proper error back that fits clients handling
    
  });
});



var port = Number(process.env.PORT || 5000);
app.listen(port);