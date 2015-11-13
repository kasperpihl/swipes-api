$(function(){
	// Holder for the apps objects
	window._apps = [];
	// Underscore rendered template, check admin.html for app-row-template
	window.appTemplate = _.template($("#app-row-template").html(), {variable: "data"});
	
	swipes.navigation.setBackgroundColor("#ededed")
	swipes.navigation.setForegroundColor("dark")

	// Call underlying swipes api 
	function loadApps(){
		swipes._client.callSwipesApi("apps.list", function(res, error){
			if(res && res.ok){
				console.log(res);
				window._apps = res.apps;
				render();
			}
			else console.log("error loading apps");
		});
	}
	function render(){
		$(".app-list").html("");
		for(var i = 0 ; i < _apps.length ; i++)
			renderApp(_apps[i], true);
	}
	function renderApp(app, insert){
		renderedApp = appTemplate(app);
		if(insert)
			$(".app-list").append(renderedApp);
		else
			$(".app-list #app-" + app.id).replaceWith(renderedApp);
	}
	loadApps();
	setTimeout(function(){
		swipes.navigation.setTitle("Kristjan");
	}, 3000);
	
});