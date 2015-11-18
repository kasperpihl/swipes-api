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
		$(".app-list.active").append("<h5>enable</h5>");
		$(".app-list.deactive").append("<h5>disabled</h5>");	
		for(var i = 0 ; i < _apps.length ; i++){
			var app = _apps[i];
			var renderedApp = appTemplate(app);
			if(app.is_active) {	
				$(".app-list.active").append(renderedApp);	
			} else {
				$(".app-list.deactive").append(renderedApp);
			}	
		}

		if ($('.app-list.active').children('.app').length == 0) {
			$(".app-list.active").append("<p>Sorry, none of the apps are currently enabled.</p>");
		} else if ($('.app-list.deactive').children('.app').length == 0) {
			$(".app-list.deactive").append("<p>Sorry, none of the apps are currently disabled.</p>");
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
	
	$(window).resize(function() {
		var adminTabs = $('.nav'); 
		var selectedLine = $('.selected-line');
		var tabSelected = $('.nav').find('.selected');
		var tabData = tabSelected.attr('data-tab');
		
		if (tabData == 1) {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = (100 / 3) / 3;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		} else if (tabData == 2) {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = ((100 / 3) / 3) * 4;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		} else {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = ((100 / 3) / 3) * 7;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		}
	})
	
	$('.tab').click(function() {
		$('.tab').removeClass('selected');
		$(this).addClass('selected');
		
		var adminTabs = $('.nav'); 
		var selectedLine = $('.selected-line');
		
		var tabData = $(this).attr('data-tab');
		
		if (tabData == 1) {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = (100 / 3) / 3;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		} else if (tabData == 2) {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = ((100 / 3) / 3) * 4;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		} else {
			var adminTabsWidth = adminTabs.width();
			var translatePercentage = ((100 / 3) / 3) * 7;
			var translatePixels = adminTabsWidth * translatePercentage / 100;
			selectedLine.css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');
		}
	});
	
	$(".ripple").click(function(e){
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