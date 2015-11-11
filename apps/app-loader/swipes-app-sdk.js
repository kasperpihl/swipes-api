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
			self._client.callListener("navigation.setTitle",{"title":title});
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
	SwipesAppSDK.prototype.myapp = {
		// Manifest will be loaded in here
	};

	// API for handling data
	SwipesAppSDK.prototype.api = {
		get:function(options, callback){
			
			var queryData = {
				appId: self.myapp.manifest.identifier
			};
			if(typeof options === 'string')
				queryData.table = options;
			else if(typeof options === 'object' && typeof options.table === 'string'){
				table = options.table;
			}
			else{
				throw new Error("SwipesAppSDK: Get request must have table")
			}
			console.log(queryData);
			self._client.callSwipesApi("apps.saveData", queryData, callback);
		},
		save: function(options, saveData, callback){
			_this._client.callSwipesApi();
		},
		on:function(event, callback){

		}
	};

	// API for handling calls from main app
	SwipesAppSDK.prototype.connectorHandleResponseReceivedFromListener = function(connector, message, callback){
		if(callback)
			callback("yeah");
	};
	SwipesAppSDK.prototype.update = {

	};
	return SwipesAppSDK;

})();