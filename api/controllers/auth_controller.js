// ===========================================================================================================
// Sync Controller - Handling Client Sync
// ===========================================================================================================


var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Collections = 	require(COMMON + 'collections/collections.js');
var Parse = 		require('parse').Parse;
var util =			require(COMMON + 'utilities/util.js');
var Q = require("q");


// ===========================================================================================================
// Instantiation
// ===========================================================================================================

function AuthController( userId, client, logger ){
	this.userId = userId;
	this.logger = logger;
	this.client = client;
};


// ===========================================================================================================
// Main auth function - called from the request and handles the auth process
// ===========================================================================================================

AuthController.prototype.auth = function ( req, callback ){
	var self = this;
	var body = req.body;

};




module.exports = AuthController;