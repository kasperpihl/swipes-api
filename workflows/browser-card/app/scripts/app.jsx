const React = require('react');
const ReactDOM = require('react-dom');
const {HomeProvider, Home} = require('./components/home');

const HomePage = new HomeProvider(Home);

ReactDOM.render(<HomePage />, document.getElementById('content'));

swipes.onReady (function () {
	console.log('we are here');
});
