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
						<Sidebar.Section data={{title:"My Apps", section:"apps", rows:this.state.apps}}/>
						<Sidebar.Section data={{title:"Groups", section:"groups", rows: this.state.channels}}/>
						<Sidebar.Section data={{title:"People", section:"people", rows: this.state.channels}}/>
					</div>
				</div>
			</aside>
		);
	}
});
Sidebar.Section = React.createClass({
	onSectionHeader: function(){
		console.log(this.props.data.section);
	},
	render: function(){
		var renderRows = [];
		for(var i = 0 ; i < this.props.data.rows ; i++){
			var row = this.props.data.rows[i];
			renderRows.push()
		}
		return (
			<div className="sidebar-section">
				<h1 onClick={this.onSectionHeader}>{this.props.data.title}</h1>
				<ul className="rows">
					{renderRows}
				</ul>
			</div>
		);
	}
});
Sidebar.Row = React.createClass({
	render: function(){
		return (
			<li>{this.props.data.name}</li>
		);
	}
});
module.exports = Sidebar;
