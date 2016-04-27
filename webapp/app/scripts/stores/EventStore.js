var Reflux = require('reflux');
var eventActions = require('../actions/EventActions');

var EventStore = Reflux.createStore({
	listenables: [ eventActions ],
	onAdd: function(name, callback, ctx){
		if(!name || typeof name !== 'string'){
			return console.warn('EventStore: event name not set or not string');
		}
		if(!callback || typeof callback !== 'function')
			return console.warn("EventStore: callback not set, couldn't add");


		var currentListeners = this.get(name);

		if(!currentListeners){
			currentListeners = [];
		}

		currentListeners.push({callback: callback, context: ctx});
		this.set(name, currentListeners);
	},
	_clearEventName:function(name, callback, context){
		var currentListeners = this.get(name);

		// If only event name is provided, remove all
		if(!callback && !context)
			return this.unset(name);

		var newListeners = [];
		if(currentListeners){
			for(var i = 0 ; i < currentListeners.length ; i++){
				var listener = currentListeners[i];
				if(listener.callback !== callback && listener.context !== context)
					newListeners.push(listener);
			}
		}
		if(!newListeners.length)
			this.unset(name);
		else if(newListeners.length != currentListeners.length)
			this.set(name, newListeners);
	},
	onRemove: function(name, callback, context){
		if(name){
			this._clearEventName(name, callback, context);
		}
		else{
			for(var key in this.get()){
				this._clearEventName(key, callback, context);
			}
		}
	},
	onFire: function(name, data){
		var currentListeners = this.get(name);
		if(!currentListeners || !currentListeners.length)
			return;

		for(var i = 0 ; i < currentListeners.length ; i++){
			var listener = currentListeners[i];
			listener.callback(data);

		}

	}
});

module.exports = EventStore;
