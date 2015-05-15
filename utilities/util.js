var crypto    = require('crypto');
var awsRegion =     'us-east-1';
var QueueUrl = 'https://sqs.us-east-1.amazonaws.com/745159268654/Swipes';

exports.getIntercomHmac = function( userId ){
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


exports.sendBackError = function( error, res, logs ){
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

exports.sendSqsMessage = function(message, callback) {
  'use strict';
 
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: awsRegion
  });
  sqs = new AWS.SQS();
 
  var params = {
    MessageBody: message,
    QueueUrl: QueueUrl,
    DelaySeconds: 0
  };
 
  sqs.sendMessage(params, function (err, data) {
    if (err) {
      if(callback){
        callback(false, err);
      }
    }
    else {
      if(callback){
        callback(true, false);
      }
    }
  });
}