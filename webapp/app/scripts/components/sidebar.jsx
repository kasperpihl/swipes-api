var React = require('react');
var Reflux = require('reflux');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var Sidebar = React.createClass({
	mixins: [Reflux.connect(channelStore, "channels"), Reflux.connect(appStore, "apps")],
	render: function() {
		return (
			<aside className="sidebar left">
				<div className="sidebar_content">
					<div className="sidebar-controls">
						<Sidebar.Section data={{title:"My Apps", apps:this.state.apps}}/>
						<Sidebar.Section data={{title:"Groups"}}/>
						<Sidebar.Section data={{title:"People"}}/>
					</div>
				</div>
			</aside>
		);
	}
});
Sidebar.Section = React.createClass({
	render: function(){
		return (
			<div className="sidebar-section">
				<h1>{this.props.data.title}</h1>
			</div>
		);
	}
});
Sidebar.Row = React.createClass({
	render: function(){
		return (
			<li></li>
		);
	}
});
module.exports = Sidebar;
