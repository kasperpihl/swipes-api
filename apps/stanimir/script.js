$(function(){
	swipes.stani = {};

	swipes.currentApp().get("stanimir").then(function(stanimirs){
		return swipes.currentApp().save({table:"stanimir"}, {"test": "hello"});	
	}).then(function(){

	});

	swipes.navigation.push("New title here");

	swipes.navigation.onPop(function(){
		console.log("stani just popped some tags");
	});

})