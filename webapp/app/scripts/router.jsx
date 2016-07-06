var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
var render = require('react-dom').render;

var App = require('./components/app');
var Workspace = require('./components/workspace');
var Services = require('./components/services');
var Signin = require('./components/signin');
var Signup = require('./components/signup');
var redirect = require('./components/redirect_flow');
var Test = require('./components/resizeable-grid/grid_test');
exports.start = function() {
	render ((
		<Router history={browserHistory}>
			<Route path="signin" component={Signin} onEnter={redirect.toHome} />
			<Route path="signup" component={Signup} onEnter={redirect.toHome} />
			<Route path="test" component={Test} />
			<Route path="/" component={App}>
				<IndexRoute component={Workspace} onEnter={redirect.toSignUp} />
				<Route path="workspace" component={Workspace} onEnter={redirect.toSignUp} />
				<Route path="services" component={Services} onEnter={redirect.toSignUp} />
			</Route>
		</Router>
	), document.getElementById('content'));
}
