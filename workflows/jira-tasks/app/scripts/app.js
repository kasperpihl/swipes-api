require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var mainStore = require('./stores/MainStore');
var Home = require('./components/home');
ReactDOM.render(<Home />, document.getElementById('content'));

swipes.onReady(function(){
	mainStore.fetch();
})