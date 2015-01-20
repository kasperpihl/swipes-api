var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var Parse = require('parse').Parse;
var keys = require('../utilities/keys.js');
keys.setLive(true);

var Logger =          require( '../utilities/logger.js' );
var PGClient =        require('../postgres/pg_client.js');
var MoveController =  require('./move_controller.js');
var FetchController = require('./fetch_controller.js')

app.route( '/move' ).get( function( req, res ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var logger = new Logger();
  var client = new PGClient( logger );
  if ( !req.query.fromUser)
    return res.jsonp({code:142,message:"fromUser must be specified"});

  if ( !req.query.toUser)
    return res.jsonp({code:142,message:"toUser must be specified"});

  var moveController = new MoveController( client, logger );
  moveController.copyDataFromUserToUser( req.query.fromUser, req.query.toUser, function(results, error){
    console.log(results);
    console.log(error);
    res.jsonp(results);
  });
  return ;
});

app.route( '/loadEmails').get( function( req, res){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var logger = new Logger();
  var fetchController = new FetchController( false, logger );
  fetchController.fetchSignups(function( result, error ){
    //console.log( error );
    res.jsonp( result );
  });
});

app.route( '/fetch' ).get( function( req, res ){
  Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

  var logger = new Logger();
  var client = new PGClient( logger );
  var fetchController = new FetchController( client, logger );
  fetchController.fetchList(function( result, error ){
    //console.log( error );
    res.jsonp( result );
  });
});


var port = Number(process.env.PORT || 5000);
app.listen(port);