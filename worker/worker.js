//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
    http    =       require( 'http' ),
    _ =             require( 'underscore' ),
    AWS =           require( 'aws-sdk' ),
    bodyParser =    require( 'body-parser' ),
    awsRegion =     'us-east-1',
    sqs =           {},
    crypto    = require('crypto');
var Parse = require('parse').Parse;
var keys = require('../utilities/keys.js');
http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: 3000000 } ) );
app.route( '/').get( function(req,res,next){
  console.log("main");
  res.send("Swipes synchronization services - online");
});
app.route( '/work').post( function(req,res,next){
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: awsRegion
    });
  sqs = new AWS.SQS();

  console.log('response: ', req.body);
  console.log('Starting receive message.', '...a 200 response should be received.');
  res.send("success");
});

var port = Number(process.env.PORT || 5000);
app.listen(port);