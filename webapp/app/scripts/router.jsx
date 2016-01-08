var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require('./components/layout');
var Home = require('./components/home');
var Login = require('./components/login');
var routes = (
	<Route name="layout" path="/" handler={Layout}>
		<Route path="login" handler={Login} />
		<Route path="app/:appId" handler={Home} />
		<Route path="overlay/:overlayId" handler={Home} />
		<DefaultRoute handler={Home} />
	</Route>
);

exports.start = function() {
  
  Router.run(routes, function (Handler) {
		ReactDOM.render(<Handler />, document.getElementById('content'));
	});
}