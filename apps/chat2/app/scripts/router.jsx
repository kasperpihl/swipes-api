var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require('./components/layout');
var ChatList = require('./components/chatlist');

var routes = (
	<Route name="layout" path="/" handler={Layout}>
		<DefaultRoute handler={ChatList} />
	</Route>
);

exports.start = function() {
	Router.run(routes, function (Handler) {
		React.render(<Handler />, document.getElementById('content'));
	});
}
