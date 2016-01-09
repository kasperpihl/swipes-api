require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var chatStore = require('./stores/ChatStore');
var ChatList = require('./components/chatlist');
ReactDOM.render(<ChatList />, document.getElementById('content'));

swipes.onReady(function(){
	chatStore.start();
})

