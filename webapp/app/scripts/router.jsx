var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
var render = require('react-dom').render;

var App = require('./components/app');
var Home = require('./components/home');
var Services = require('./components/services');
var Signin = require('./components/signin');
var Signup = require('./components/signup');
var redirect = require('./components/redirect_flow');


exports.start = function() {
	render ((
		<Router history={browserHistory}>
			<Route path="signin" component={Signin} onEnter={redirect.toHome} />
			<Route path="signup" component={Signup} onEnter={redirect.toHome} />
			<Route path="/" component={App}>
				<IndexRoute component={Home} onEnter={redirect.toLogin} />
				<Route path="workflow/:workflowId" component={Home} onEnter={redirect.toLogin} />
				<Route path="services" component={Services} onEnter={redirect.toLogin} />
			</Route>
		</Router>
	), document.getElementById('content'));
}
