var SwipesAppSDK = (function() {
	var self;
	function SwipesAppSDK(apiUrl, token) {
		if (!SwipesAPIConnector){
			throw new Error("SwipesAppSDK: SwipesAPIController not loaded first")
		}
		if (!apiUrl){
			throw new Error("SwipesAppSDK: No apiUrl set in constructor");
		}
		if (!token) {
			throw new Error("SwipesAppSDK: No token set in constructor");
		}

		this._client = new SwipesAPIConnector(apiUrl, token);
		// set the sdk property on client so it can call this class
		this._client.setDelegate(this);
		self = this;
	}

	// API for handling navigation bar in main app
	SwipesAppSDK.prototype.navigation = {
		// Setting the title of the navigation bar manually
		setTitle:function(title){
			console.log("new title", _this, swipes);
			_this._client.callMainApp("navigation.setTitle",{"title":"Inbox Tetris"});
		},
		// Push new title (view), will show a backbutton.
		push: function(title, identifier){

		},
		// Pops back one title
		pop: function(){

		},
		setColors:function(backgroundColor, foregroundColor){
			
		}
	};

	// API for handling data
	SwipesAppSDK.prototype.api = {
		get:function(options, callback){

		},
		save: function(options, saveData, callback){
			_this._client.callSwipesApi();
		},
		on:function(event, callback){

		}
	};

	// API for handling calls from main app
	SwipesAppSDK.prototype.handleLowLevelCallFromConnector = function(connector, message){

	};
	SwipesAppSDK.prototype.update = {

	};
	return SwipesAppSDK;

})();