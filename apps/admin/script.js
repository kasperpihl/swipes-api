$(function(){
	// Holder for the apps objects
	window._apps = [];
	// Underscore rendered template, check admin.html for app-row-template
	window.appTemplateActive = _.template($("#active-app-row-template").html(), {variable: "data"});
	window.appTemplateDeactive = _.template($("#deactive-app-row-template").html(), {variable: "data"});
	
	swipes.navigation.setBackgroundColor("#ededed")
	swipes.navigation.setForegroundColor("dark")
	
	
	//swipes.navigation.enableBoxShadow(false) to disable boxshadow

	// Call underlying swipes api 
	function loadApps(){
		swipes._client.callSwipesApi("apps.list", function(res, error){
			if(res && res.ok){
				console.log(res);
				window._apps = res.apps;
				render();
				
				$('.hover-full').swButtonFullHover();
			}
			else console.log("error loading apps");
		});
	}
	function render(){
		$(".app-list").html("");
		for(var i = 0 ; i < _apps.length ; i++){
			var app = _apps[i];
			if(app.is_active) {
				var renderedApp = appTemplateActive(app);
				$(".app-list.active").append(renderedApp);	
			} else {
				var renderedApp = appTemplateDeactive(app);
				$(".app-list.deactive").append(renderedApp);	
			}	
		}

	}
	loadApps();

	
});