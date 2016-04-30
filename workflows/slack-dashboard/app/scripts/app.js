require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var chatStore = require('./stores/ChatStore');
var chatActions = require('./actions/ChatActions');
var channelStore = require('./stores/ChannelStore');
var chatInputActions = require('./actions/ChatInputActions');
var ChatList = require('./components/chatlist');
ReactDOM.render(<ChatList />, document.getElementById('content'));

swipes.onReady(function(){
	chatStore.start();
});

swipes.onShareInit(function(e) {
	var channels = channelStore.getActive();
	var currentChatId = chatStore.get('channelId');

	if (channels.length > 0) {
		var currentChannel = channels.find(function (channel) {
			return channel.id === currentChatId;
		})

		return {
			name: '#'+ currentChannel.name +' - Send a message',
			action: 'send message'
		}
	}
});

swipes.onShareTransmit(function(e) {
	var data = e.data.data;

	var input = data.data.text || data.data.url || ''; // e.data.data.data.data...

	if (input) {
		chatInputActions.changeInputValue(input);
		document.getElementById('chat-input').focus();
	}
});

swipes.onAppFocus(function(e){
	chatActions.checkSocket(e);
});
