swipes.onReady(function(){
	console.log("we are ready!");
	//swipes.navigation.setTitle('Title test');
	swipes.stani = {};

	// swipes.currentApp().get("stanimir").then(function(stanimirs){
	// 	return swipes.currentApp().save({table:"stanimir"}, {"test": "hello"});	
	// }).then(function(){

	// });
	
	swipes.navigation.onButtonPressed(function(data){
		console.log("button was pressed");
		console.log(data);
	});
	
	//swipes.navigation.push("New title here");

	swipes.navigation.onPop(function(){
		console.log("stani just popped some tags");
	});
	
	doSetButtons();

	swipes.navigation.setTitle('Best App Ever');
})

function doPush() {
	swipes.navigation.push("New title here");
}

function doSetButtons()
{
	swipes.navigation.setButtons([
		{
			image: "http://no-comment.bg/uploads/post-images/20151124/photo_small_17725.jpg",
			id: "delete_button",
			title: "Delete"
		},
		{
			id: "add_button",
			title: "Add",
			icon: "plus",
			// iconFont: "fontawesome",
			// iconFont: "swipes",
		},
	]);
}
