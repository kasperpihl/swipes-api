var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require('./components/layout');
var Home = require('./components/home');
var Services = require('./components/services');
var Login = require('./components/login');
var Signup = require('./components/signup');
var routes = (
	<Route name="layout" path="/" handler={Layout}>
		<Route path="login" handler={Login} />
		<Route path="signup" handler={Signup} />
		<Route path="workflow/:workflowId" handler={Home} />
		<Route path="overlay/:overlayId" handler={Home} />
		<Route path="services" handler={Services} />
		<DefaultRoute handler={Home} />
	</Route>
);

exports.start = function() {

  Router.run(routes, function (Handler) {
		ReactDOM.render(<Handler />, document.getElementById('content'));
	});
}
