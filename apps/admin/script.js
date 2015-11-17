$(function(){
	// Holder for the apps objects
	window._apps = [];
	// Underscore rendered template, check admin.html for app-row-template
	window.appTemplate = _.template($("#app-row-template").html(), {variable: "data"});
	
	
	//swipes.navigation.enableBoxShadow(false) to disable boxshadow

	// Call underlying swipes api 
	function loadApps(){
		swipes._client.callSwipesApi("apps.list", function(res, error){
			if(res && res.ok){
				console.log(res);
				window._apps = res.apps;
				render();
				
				$.swContextMenu();
			}
			else console.log("error loading apps");
		});
	}
	function render(){
		$(".app-list").html("");
		for(var i = 0 ; i < _apps.length ; i++){
			var app = _apps[i];
			var renderedApp = appTemplate(app);
			if(app.is_active) {
				$(".app-list.active").append(renderedApp);	
			} else {
				$(".app-list.deactive").append(renderedApp);	
			}	
		}

	}
	loadApps();
	function installApp(appId){
		swipes._client.callSwipesApi("apps.install", {app_id: appId}, function(res, error){
			if(res && res.ok){
				console.log("successful install");
			}
			else console.log("error loading apps");
		});
	}
	
	$('.tab').click(function() {
		$('.tab').removeClass('selected');
		$(this).addClass('selected');
		
		var index = $('.nav').find('.tab').index(this);
		var selectedLine = $('.selected-line');
		
		if (index == 0) {
			selectedLine.css('left', 'calc((100% / 3) / 3)')
		} else if (index == 1) {
			selectedLine.css('left', 'calc(((100% / 3) / 3) * 4)')
		} else {
			selectedLine.css('left', 'calc(((100% / 3) / 3) * 7)')
		}
	});
	
	$(".tab").click(function(e){
		 self = $(this);

		 if(self.find(".woba").length == 0)
			  self.prepend("<span class='woba'></span>");

		 woba = self.find(".woba");

		 woba.removeClass("animate");


		 if(!woba.height() && !woba.width())
		 {

			  d = Math.max(self.outerWidth(), self.outerHeight());
			  woba.css({height: d, width: d});
		 }


		 x = e.pageX - self.offset().left - woba.width()/2;
		 y = e.pageY - self.offset().top - woba.height()/2;


		 woba.css({top: y + 'px', left: x+'px'}).addClass("animate");
	})
});