const React = require('react');
const ReactDOM = require('react-dom');
const {HomeProvider, Home} = require('./components/home');

const HomePage = new HomeProvider(Home);

ReactDOM.render(<HomePage />, document.getElementById('content'));

swipes.ready (function () {
	console.log('we are here');
});
