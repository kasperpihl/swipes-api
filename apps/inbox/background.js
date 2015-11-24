/*
	Expect an array with the format
	{
		title: "test",
		id: "table",
		link: {}
	}
 */
swipes.handlers.searchHandler = function(string, callback){
	Gmail.search(string, function(res){
		callback(res)
	})
}