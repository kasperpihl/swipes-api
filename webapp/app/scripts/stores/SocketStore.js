var Reflux = require('reflux');

// Stores
var WorkflowStore = require('./WorkflowStore');
var WorkspaceStore = require('./WorkspaceStore');
var userStore = require('./UserStore');
var serviceStore = require('./ServiceStore');
var stateStore = require('./StateStore');

// Actions
var stateActions = require('../actions/StateActions');
var socketActions = require('../actions/SocketActions');
var eventActions = require('../actions/EventActions');

var browserHistory = require('react-router').browserHistory;

var SocketStore = Reflux.createStore({
	listenables: [ socketActions ],
	onStart: function(){
		var self = this;

		swipes.api.request("rtm.start").then(function(res){
			if(res.ok) {
				self.connect(res.url);
				userStore.batchLoad(res.users, {flush:true, trigger:false});
				res.self.me = true;
				amplitude.setUserId(res.self.id);
				mixpanel.identify(res.self.id);
				mixpanel.people.set({
					"$email": res.self.email,
					"$created": res.self.created,
					"$name": res.self.name
				})
				userStore.update(res.self.id, res.self);
				WorkflowStore.workflow_base_url = res.workflow_base_url;
				WorkflowStore.batchLoad(res.workflows, {flush:true});
				serviceStore.batchLoad(res.services, {flush:true});
				stateActions.changeStarted(true);
			}
		}).fail(function (error) {
			if (!error.ok && error.err === 'not_authed') {
				localStorage.clear();

				return browserHistory.push('/signin');
			}
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

			if(msg.type === 'workflow_added' || msg.type === 'workflow_changed'){
				WorkflowStore.update(msg.data.id, msg.data);
			}
			else if (msg.type === 'workflow_removed'){
				WorkspaceStore.unset(msg.data.id);
				WorkflowStore.unset(msg.data.id);
			}

			if (msg.type === 'service_added' || msg.type === 'service_changed') {
				var user = userStore.me();

				user.services = user.services || [];
				// T_TODO if it's updated we should replace not push to the array
				user.services.push(msg.data);
				// The update of reflux model extension will fix this.
				userStore.update(user.id, user);
			}

			if (msg.type === 'service_removed') {
				var user = userStore.me();

				user.services = _.filter(user.services, function(service){
					if(service.id === msg.data.id && service.service_name === msg.data.service_name){
						return false;
					}
					return true;
				});
				userStore.update(user.id, user);
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
