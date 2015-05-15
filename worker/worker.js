//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    http    =       require( 'http' ),
    _ =             require( 'underscore' ),
    crypto    = require('crypto');
var Parse = require('parse').Parse;
var keys = require('../utilities/keys.js');
http.globalAgent.maxSockets = 25;

var app = express();
app.route( '/').get( function(req,res,next){
  console.log("main");
  res.send("Swipes synchronization services - online");
});
app.route( '/work').post( function(req,res,next){
  console.log(req);
  res.send("success");
});

var port = Number(process.env.PORT || 5000);
app.listen(port);