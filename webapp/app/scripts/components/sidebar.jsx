var React = require('react');
var Reflux = require('reflux');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var stateStore = require('../stores/StateStore');
var Sidebar = React.createClass({
	mixins: [Reflux.ListenerMixin, channelStore.connect("channels"), appStore.connect("apps")],
	onStateChange: function(states){
		var toggle = states["sidebarClosed"] ? true : false;
		$("body").toggleClass("sidebar-closed", toggle);
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
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
		var self = this;
		var rows = this.props.data.rows.map(function(row){
			if(self.props.data.section === "apps"){
				if(!row.main_app || !row.is_active)
					row.hidden = true;
			}
			else if(self.props.data.section === "groups"){
				if(row.type === "direct" || row.is_archived)
					return false;
				if(!row.is_member)
					row.hidden = true;
			}
			else if(self.props.data.section === "people"){
				if(row.type !== "direct")
					return false;
				if(!row.is_open)
					row.hidden = true;
			}
			return <Sidebar.Row key={row.id} data={row} />
		});

		return (
			<div className="sidebar-section">
				<h1 onClick={this.onSectionHeader}>{this.props.data.title}</h1>
				<ul className="rows">
					{rows}
				</ul>
			</div>
		);
	}
});
Sidebar.Row = React.createClass({
	clickedRow: function(){
		console.log("clicked row", this.props.data);
	},
	render: function(){
		var className = "row ";
		if(this.props.data.hidden)
			className += "hidden ";
		if(this.props.data.unread_count)
			className += "unread ";
		if(this.props.data.is_active_menu)
			className += "active ";
		return (
			<li className={ className } onClick={this.clickedRow}>
				<div className="text">
					{this.props.data.name}
				</div>
				<span className="notification chat">{this.props.data.unread_count_display}</span>
			</li>
		);
	}
});
module.exports = Sidebar;
