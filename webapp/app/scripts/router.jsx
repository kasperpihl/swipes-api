var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
var render = require('react-dom').render;

var Home = require('./components/home');
var Services = require('./components/services');
var Login = require('./components/login');
var Signup = require('./components/signup');
var redirect = require('./components/redirect_flow');


exports.start = function() {
  render ((
		<Router history={browserHistory}>
			<Route path="/">
				<IndexRoute component={Home} onEnter={redirect.toLogin} />
				<Route path="login" component={Login} onEnter={redirect.toHome} />
				<Route path="signup" component={Signup} />
				<Route path="workflow/:workflowId" component={Home} onEnter={redirect.toLogin} />
				<Route path="services" component={Services} onEnter={redirect.toLogin} />
			</Route>
		</Router>
	), document.getElementById('content'));
}
