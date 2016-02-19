require('reflux-model-extension');
require("react-tap-event-plugin")();

var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/home');
var MainStore = require('./stores/MainStore');
var MainActions = require('./actions/MainActions');

ReactDOM.render(<Home />, document.getElementById('content'));

swipes.onReady (function () {
	MainStore.fetch();
});

swipes.onShareRequest(function(message, callback) {
	console.log(message);
	console.log('Message received - Create Issue Card');
	callback([{title: 'Create Issue Card'}]);
});

swipes.onMenuButton(function () {
	var projects = MainStore.getAll();
	var navItems = [];

	_.each(projects, function (project) {
		// batchLoad the projects and settings end up at the same state
		// so this cause some problems with the nav menu when the key is undefined
		if (project && project.key) {
			var item = { id: project.key, title: project.name };

			navItems.push(item);
		}
	});

	swipes.modal.leftNav({items: navItems}, function (res, err) {
		if (res) {
			MainActions.updateSettings({projectKey: res});
		}
		console.log('response from nav', res, err);
	})
});
