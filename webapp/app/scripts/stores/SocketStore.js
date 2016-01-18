var Reflux = require('reflux');

// Stores
var WorkflowStore = require('./WorkflowStore');
var userStore = require('./UserStore');
var serviceStore = require('./ServiceStore');
var stateStore = require('./StateStore');
var eventStore = require('./EventStore');

// Actions
var stateActions = require('../actions/StateActions');
var socketActions = require('../actions/SocketActions');
var eventActions = require('../actions/EventActions');

var SocketStore = Reflux.createStore({
	listenables: [ socketActions ],
	onStart: function(){
		var self = this;

		swipes._client.callSwipesApi("rtm.start").then(function(res){
			if(res.ok){

				userStore.batchLoad(res.users, {flush:true, trigger:false});
				res.self.me = true;
				amplitude.setUserId(res.self.id);
				userStore.update(res.self.id, res.self);
				WorkflowStore.workflow_base_url = res.workflow_base_url;
				WorkflowStore.batchLoad(res.workflows, {flush:true});

				serviceStore.batchLoad(res.services, {flush:true});
				self.connect(res.url);
				stateActions.changeStarted(true);
				
			}
		}).fail(function(err){
			console.log("rtm start err", err);
		})
	},
	connect: function(url){
		var self = this;
		self.set("status", "connecting");
		this.webSocket = io.connect(url, {
			query: 'token=' + swipes.getToken(),
			reconnectionDelay: 5000
		});
		this.webSocket.on('message', function(msg){
			console.log("websocket", msg);
			if(!msg.type)
				return;

			if (msg.type === 'app_installed'){
				WorkflowStore.update(msg.data.id, msg.data);
			}
			else if (msg.type === 'app_uninstalled'){
				WorkflowStore.unset(msg.data.id);
			}
			else if (msg.type === 'app_activated' || msg.type === 'app_deactivated'){
				var activated = (msg.type === 'app_activated') ? true : false;
				WorkflowStore.update(msg.data.id, {is_active: activated});
			}


			eventActions.fire("websocket_" + msg.type, msg);
		});
		this.webSocket.on('connect', function(){
			self.set("status", "online");
		});
		this.webSocket.on('connect_error', function(err){
			self.set("status", "offline");
		})
		this.webSocket.on('reconnect_attempt', function(number){
			self.set("status","connecting");
		});
		this.webSocket.on('disconnect', function () {
			self.set("status", "offline");
		});
	}

});

module.exports = SocketStore;
