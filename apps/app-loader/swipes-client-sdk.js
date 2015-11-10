var SwipesClientSDK = (function() {
	var self;
	function SwipesClientSDK(client) {
		console.log("client", client);
		this._client = new client("te");
		// set the sdk property on client so it can call this class
		this._client._sdk = this;
		self = this;
	}

	// API for handling navigation bar in main app
	SwipesClientSDK.prototype.navigation = {
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
	SwipesClientSDK.prototype.api = {
		get:function(options, callback){

		},
		save: function(options, saveData, callback){
			_this._client.callSwipesApi();
		},
		on:function(event, callback){

		}
	};

	// API for handling calls from main app
	SwipesClientSDK.prototype.handleLowLevelCall = function(message){

	};
	SwipesClientSDK.prototype.update = {

	};
	return SwipesClientSDK;

})();