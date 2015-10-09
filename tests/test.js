var app = require("../instance.js");
var http = require('http');
var request = require('request');

var bodyText = '{"sessionToken":"ylprdyhogqjd2pwqtpckvw0b5","platform":"web","version":1,"syncId":"hidV11u","sendLogs":false,"changesOnly":true,"objects":{"Tag":[],"ToDo":[{"attachments":null,"title":"Test task 1","order":0,"schedule":{"__type":"Date","iso":"2015-10-09T00:08:16.134Z"},"completionDate":null,"repeatOption":"never","repeatDate":null,"repeatCount":0,"tags":[],"notes":"","parentLocalId":null,"priority":0,"origin":null,"originIdentifier":null,"objectId":"cYHGGPSg0WCi8","tempId":"cYHGGPSg0WCi8","deleted":false}]}}';

var server = http.createServer(app)
server.listen(5000, function() {
  //console.log('listening on 5000')
  app.testQuery(function(err, rows) {
    //console.log('query tested', rows)

    const options = {
      json: true,
      body: JSON.parse(bodyText)
    }

    request.post('http://localhost:5000/v1/sync', options, function(err, res) {
      console.log('closing server')
      server.close()
    })
  });
});
