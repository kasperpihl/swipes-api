// ===========================================================================================================
// API Controller - Handling API Requests (routes) from the Public api
// ===========================================================================================================

var ParentHandler =		require("./parent_handler.js");

var COMMON = 			'../common/';
var inherits = 			require('util').inherits;
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var PGClient =        	require("./pg_client.js");
var Q = 				require("q");



// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function ChannelsHandler(){
	ParentHandler.call(this);
};
inherits(ChannelsHandler, ParentHandler);


// ===========================================================================================================
// Authorization and Request Validation
// ===========================================================================================================
// TODO!


// ===========================================================================================================
// API Calls
// ===========================================================================================================


// Call Action
// ===========================================================================================================
ChannelsHandler.prototype.callAction = function (action, req, res){
	if(action.startsWith("channels.")){
		this.goForIt();
	}
	res.send("here" + action);
};


module.exports = ChannelsHandler;