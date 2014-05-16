var express =     require( 'express' ),
    bodyParser =  require( 'body-parser' ),
    Parse =       require( 'parse' ).Parse,
    _ =           require( 'underscore' );

var app = express();
app.use(bodyParser.json());

var keys =      require('./conf/keys.js');
var Logger =    require('./server/logger.js');
var Postgres =  require('./server/postgres.js');
var parse =     require('./server/parse.js');

app.route('/sync').post(function(req, res) {
  var startTime = new Date().getTime();
  Parse.initialize(keys.get("applicationId"),keys.get("javaScriptKey"),keys.get("masterKey"));
  res.setHeader('Content-Type', 'application/json');

  if(!req.body.sessionToken){
    return res.send({code:142,message:"sessionToken must be included"});
  }

  var logger = new Logger();
  logger.time("timing");
  var postgres = new Postgres(logger);
  Parse.User.become(req.body.sessionToken).then(function(result){
    logger.time('Started request');
    logger.setIdentifier(result.id);
    postgres.sync(req.body, result.id, function(result,error){
      var endTime = new Date().getTime();
        var time = endTime - startTime;
        logger.log('Finished request in (' + time + " ms)");
      if(result) res.send(result);
      else{
        logger.log('Error from return ' + error,true);
        var sendError = {code:141,message:'Server error'};
        if(error && error.code) sendError.code = error.code;
        if(error && error.message) sendError.message = error.message;
        res.send(sendError);
      }
    });
  },function(error){ res.send(error); });
});
var port = Number(process.env.PORT || 5000);
app.listen(port);