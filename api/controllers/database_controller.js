// ===========================================================================================================
// DatabaseController - Handling Database requests
// ===========================================================================================================


var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Collections = 	require(COMMON + 'collections/collections.js');
var util =			require(COMMON + 'utilities/util.js');


// ===========================================================================================================
// Instantiation
// ===========================================================================================================

function DatabaseController( userId, client, logger ){
	this.userId = userId;
	this.logger = logger;
	this.client = client;
};



module.exports = DatabaseController;