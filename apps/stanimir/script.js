$(function(){
	swipes.stani = {};

	swipes.currentApp().get("stanimir").then(function(stanimirs){
		return swipes.currentApp().save({table:"stanimir"}, {"test": "hello"});	
	}).then(function(){

	});
	swipes.navigation.setButtons([
		{
			id: "add_button",
			title: "Add"
		},
		{
			id: "delete_button",
			title: "Delete"
		}
	]);
	swipes.navigation.onButtonPressed(function(data){
		console.log("button was pressed");
		console.log(data);
	});
	
	swipes.navigation.push("New title here");

	swipes.navigation.onPop(function(){
		console.log("stani just popped some tags");
	});

})

function doPush() {
	swipes.navigation.push("New title here");
}

