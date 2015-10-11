// ===========================================================================================================
// API Controller - Handling API Requests (routes) from the Public api
// ===========================================================================================================


var COMMON = 			'../common/';
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var Q = 				require("q");
var ChannelsHandler = 	require("./channels_handler.js");



// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function APIController(){

};



// ===========================================================================================================
// Authorization and Request Validation
// ===========================================================================================================
// TODO!



// ===========================================================================================================
// Result handling
// ===========================================================================================================
APIController.prototype.handleResult = function(result, error){
	// Check for timeout on the client (13 seconds operations will trigger timeout)
	if(this.client.timedout)
		return this.handleErrorResponse( {code:510, message:"Request Timed Out"} );
	if( error )
		return this.handleErrorResponse(error);
	this.handleSuccessResponse(result);
}
APIController.prototype.handleErrorResponse = function(error, log){
	this.client.end();
	util.sendBackError(error, this.res);
}
APIController.prototype.handleSuccessResponse = function(result){
	this.client.end();
	this.res.send( result );
}



// ===========================================================================================================
// API Calls
// ===========================================================================================================


// Call Action
// ===========================================================================================================
APIController.prototype.callAction = function (action, req, res){
	if(action.startsWith("channels.")){
		new ChannelsHandler().callAction(action, req, res);
	}
	//res.send(action);
};


module.exports = APIController;


if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}