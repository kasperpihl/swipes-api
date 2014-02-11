var keys = require('../conf/keys.js');
var live = keys.live();
exports.log = function(message,force){
	if(!live || force) console.log(message);
};