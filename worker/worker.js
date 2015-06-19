//require('strong-agent').profile("4805c27d826dec99b06108df1b5dab80","SwipesAPI");
var express =       require( 'express' ),
http    =       require( 'http' ),
_ =             require( 'underscore' ),
AWS =           require( 'aws-sdk' ),
bodyParser =    require( 'body-parser' ),
sqs =           {};
var Parse = require('parse').Parse;
var util = require('../common/utilities/util.js');
http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: (30 * 1024 * 1024) } ) );
app.route( '/').get( function(req,res,next){
	res.send("online");
});

app.route( '/work').post( function(req,res,next){
	AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: awsRegion
	});
	sqs = new AWS.SQS();
	var workToDo = req.body;

	console.log('response: ', req.body );
	console.log('Starting receive message.', '...a 200 response should be received.');
	res.send("success");
});


var QueryCreator = require('../database/query_creator.js');
app.route('/test').get( function(req,res,next){
	// userId in instantiation
	var creator = new QueryCreator( "kzORIThNaw");

	query = creator.getAllTasksFromServiceThatIsNotCompletedNorDeleted("evernote", function(results, error){
		// Check results for all the objects
		console.log(results);
		console.log(error);
		res.send(results);
	});

});

var port = Number(process.env.PORT || 5000);
app.listen(port);



 /*
getAllTasksFromServiceThatIsNotCompletedNorDeleted:(String)service ()
getMatchingTasksFromListOfIds:(Array)ids andService:(String)service

What should happen if:

A user deletes a task in Swipes (that is linked to an email)
- Remove Swipes list-label

A user completes a task in Swipes (that is linked to an email)
- Remove Swipes list-label

A user moves an email from the Swipes List (that has a task in Swipes)
- Leave the task, but unlink it

Object to be created:

// Generate a collection to prepare for save
var todoCollection = new Collections.Todo();
todoCollection.loadObjects( arrayOfJsonFormatBelow )
var saveQueries = todoCollection.getInsertAndSaveQueries()
pgClient.performQueries( saveQueries )

json format:
{
	tempId: util.generateId(12)
	order: -1
	schedule: util.convertDate( new Date() )
	title: thread title
	origin: "gmail"
	originIdentifier: "threadId"
	attachments: [
		{
			service: "gmail"
			identifier: "json:{"threadid":"14c15bfa50b6dd93","email":"spwatton@gmail.com”}”
			title: "threadId"
			sync: 1
		}
	]
}

*/
