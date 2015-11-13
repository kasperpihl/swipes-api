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
		this._listeners = {};
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
		setBackgroundColor:function(backgroundColor){
			self._client.callListener("navigation.setBackgroundColor", {"color": backgroundColor});			
		},
		setForegroundColor: function(foreground){
			self._client.callListener("navigation.setForegroundColor", {"color": foreground});
		}
		enableBoxShadow: function(enable){
			self._client.callListener("navigation.enableBoxShadow", {"enable": enable})
		}
	};


	SwipesAppSDK.prototype.info = {
		// Manifest will be loaded in here
	};

	SwipesAppSDK.prototype.users = {
		get: function(options, callback){
			var query = {};
			if(typeof options === 'string'){
				query.id = options;
			}
			if(typeof options === 'object'){
				if(options.id)
					query.id = options.id;
			}
			self._client.callListener("users.get", query, callback);
		}
	};


	// API for handling data from apps
	SwipesAppSDK.prototype.app = function(app_id){
		if(!app_id)
			app_id = self.info.manifest.identifier;
		return {
			get:function(options, callback){
				var data = {
					app_id: app_id,
					query: {}
				};
				if(typeof options === 'string')
					data.query.table = options;
				else if(typeof options === 'object' && typeof options.table === 'string'){
					data.query = options;
				}
				else{
					throw new Error("SwipesAppSDK: Get request must have table")
				}

				self._client.callSwipesApi("apps.getData", data, callback);
			},

			save: function(options, saveData, callback){
				var data = {
					app_id: app_id,
					query: { data: saveData }
				};
				if(typeof saveData !== 'object'){
					throw new Error("SwipesAppSDK: save: data object is required");
				}
				if(typeof options === 'string')
					data.query.table = options;
				else if(typeof options === 'object' && typeof options.table === 'string'){
					data.query.table = options.table;
					if(options.id){
						data.query.id = options.id;
					}
				}
				else{
					throw new Error("SwipesAppSDK: save: Get request must have table")
				}
				
				self._client.callSwipesApi("apps.saveData", data, callback);
			},
			on:function(event, handler){
				eventName = app_id + "_" + event
				self.listeners.add(eventName, handler);
				self._client.callListener("listenTo", {event: eventName});
			}
		}
	};

	SwipesAppSDK.prototype.listeners = {
		add: function(eventName, callback){
			var currentListeners = self._listeners[eventName];
			if(!currentListeners)
				currentListeners = [];
			currentListeners.push(callback);
			self._listeners[eventName] = currentListeners;
		},
		get: function(eventName){
			var currentListeners = self._listeners[eventName];

			if(!currentListeners)
				currentListeners = [];
			return currentListeners;
		}
	}

	// API for handling calls from main app
	SwipesAppSDK.prototype.connectorHandleResponseReceivedFromListener = function(connector, message, callback){
		if(message){
			var data = message.data;
			if(message.command == "event"){
				var listeners = self.listeners.get(data.type);
				for(var i = 0 ; i < listeners.length ; i++){

					var handler = listeners[i];

					if(handler)
						handler(message);
				}
			}
		}
		if(callback)
			callback("yeah");
	};
	SwipesAppSDK.prototype.update = {

	};
	return SwipesAppSDK;

})();