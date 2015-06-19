// ===========================================================================================================
// Background Worker - check work_controller.js for handling
// ===========================================================================================================


var express =			require( 'express' ),
http =					require( 'http' ),
_ =						require( 'underscore' ),
bodyParser = 			require( 'body-parser' ),
var Parse = 			require('parse').Parse;
var WorkController = 	require('./controllers/work_controller.js');

http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: (30 * 1024 * 1024) } ) );


app.route( '/work').post( function(req,res,next){ new WorkController(req, res).run() });

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
