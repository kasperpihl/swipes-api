require('reflux-model-extension');
var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var chatStore = require('./stores/ChatStore');
var chatActions = require('./actions/ChatActions');
var channelStore = require('./stores/ChannelStore');
var ChatList = require('./components/chatlist');
ReactDOM.render(<ChatList />, document.getElementById('content'));

swipes.onReady(function(){
	chatStore.start();
})
swipes.onMenuButton(function(){
	var channels = channelStore.getActive();
	if(channels.length){
		var navItems = [];
		_.each(channels, function(channel){
			
			var item = { id: channel.id, title: channel.name };
			if(channel.unread_count_display){
				if(channel.is_im){ // K_TODO: This should also be triggered on channels if mentioned....
					item.badge = channel.unread_count_display;
				}
				item.bold = true;
			}
			navItems.push(item);
		})
		swipes.modal.leftNav({items: navItems}, function(res, err){
			if(res){
				chatActions.setChannel(res);
				var newSettings = {channelId: res};
				swipes.api.request('users.updateWorkflowSettings', {workflow_id: swipes.info.workflow.id, settings: newSettings})
			}
			console.log('response from nav', res, err);
		})
	}
})