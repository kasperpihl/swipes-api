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

swipes.onShareTransmit(function(e) {
	console.log(e);
	var data = e.data.data;

	if (data.action === 'Create an issue') { // We have to do something smarter here
		var text = data.data.text || ''; // e.data.data.data.data...

		MainActions.updateInputValue('issueTitle', text);
	}
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
