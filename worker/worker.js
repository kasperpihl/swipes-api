// ===========================================================================================================
// Background Worker - check work_controller.js for handling
// ===========================================================================================================


var express =			require( 'express' ),
http =					require( 'http' ),
_ =						require( 'underscore' ),
bodyParser = 			require( 'body-parser' ),
Parse = 				require('parse').Parse;
var WorkController = 	require('./controllers/work_controller.js');

http.globalAgent.maxSockets = 25;

var app = express();
app.use(bodyParser.json( { limit: (30 * 1024 * 1024) } ) );


app.route( '/work').post( function(req,res,next){ new WorkController(req, res).work({"service":"gmail","userId":"ONaP54dxAu"}) });

var port = Number(process.env.PORT || 5000);
app.listen(port);



 /*
getAllTasksFromServiceThatIsNotCompletedNorDeleted:(String)service ()
getMatchingTasksFromListOfIds:(Array)ids andService:(String)service



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
