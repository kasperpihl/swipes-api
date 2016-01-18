require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var mainStore = require('./stores/MainStore');
var TaskList = require('./components/task_list');
ReactDOM.render(<TaskList />, document.getElementById('content'));

swipes.onReady(function(){
	mainStore.start();
	
})