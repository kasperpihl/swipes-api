swipes.setAppId("admin");
$(document).ready(function() {
	var adminTabsWidth = $('.nav').width();
	var translatePercentage = (100 / 3) / 3;
	var translatePixels = adminTabsWidth * translatePercentage / 100;
	$('.selected-line').css('transform', 'translate3d(' + translatePixels + 'px, 0px, 0px)');

})


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
				window._apps = res.apps;
				render();
				attachEvents();

				$.swContextMenu();
			}
			else {
				console.log("error loading apps");
			}
		});
	}
	
	function render(){
		$(".app-list").html("");
		$(".app-list.active").append("<h5>enabled</h5>");
		$(".app-list.deactive").append("<h5>disabled</h5>");
		for(var i = 0 ; i < _apps.length ; i++){
			var app = _apps[i];

			if (app.manifest_id === 'admin') {
				continue;
			}

			var renderedApp = appTemplate(app);
			if(app.is_installed) {
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

	function whichEndpoint (element) {
		if (element.hasClass("install")) {
			return "apps.install";
		} else if (element.hasClass("uninstall")) {
			return "apps.uninstall";
		} else if (element.hasClass("delete")) {
			return "apps.delete";
		}
	}

	function attachEvents() {
		$(".app-list").find(".action-btn").on("click", function () {
			var element = $(this);
			var id = element.data('id') || null;
			var manifestId = element.data('manifest-id') || null;
			var endpoint = whichEndpoint(element);
			var reqObj = {};

			if (endpoint === "apps.delete") {
				var r = confirm("Do you really want to delete this application?");

				if (r !== true) {
					return;
				}
			}

			if (id) {
				reqObj.app_id = id;
			} else {
				reqObj.manifest_id = manifestId;
			}

			changeAppState(endpoint, reqObj, element);
		})
	}

	function changeAppState(endpoint, reqObj, element){
		element.addClass('loading');

		swipes._client.callSwipesApi(endpoint, reqObj, function(res, error){
			if(res && res.ok){
				loadApps();
			}
			else {
				element.removeClass('loading');
				console.log(res.err);
			}
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

	loadApps();
});
