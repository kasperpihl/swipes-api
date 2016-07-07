var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;


var App = require('./components/app');

var Signin = require('./components/signin');
var Signup = require('./components/signup');
var redirect = require('./components/redirect_flow');
var Test = require('./components/resizeable-grid/grid_test');
export default (
		<Route path="/" component={App}>
			<Route path="/signin" component={Signin} onEnter={redirect.toHome} />
			<Route path="/signup" component={Signup} onEnter={redirect.toHome} />
		</Route>
);