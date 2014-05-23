var live = false;
if ( process.env.LIVE_ENVIRONMENT && process.env.LIVE_ENVIRONMENT == "live" )
	live = true;
console.log( live );
var options = {};
options["applicationId"] = live ? "nf9lMphPOh3jZivxqQaMAg6YLtzlfvRjExUEKST3" : "0qD3LLZIOwLOPRwbwLia9GJXTEUnEsSlBCufqDvr";
options["javaScriptKey"] = live ? "SEwaoJk0yUzW2DG8GgYwuqbeuBeGg51D1mTUlByg" : "TcteeVBhtJEERxRtaavJtFznsXrh84WvOlE6hMag";
options["masterKey"] = live ? "gIvKfS12gMjaJuT2cvdnc1uONs2XpwPSjYQX01vP" : "Xh5XMRvKPyFwNFWsnnn9RRcDQyNVFeHLwDdTu6iS";
exports.live = function(){
	return live;
}
exports.get = function(key){
	return options[key];
}