var React = require('react');
var Reflux = require('reflux');
var channelStore = require('../stores/ChannelStore');
var appStore = require('../stores/AppStore');
var stateStore = require('../stores/StateStore');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Sidebar = React.createClass({
	mixins: [Reflux.ListenerMixin, channelStore.connect("channels"), appStore.connect("apps")],
	onStateChange: function(states){
		var toggle = states["sidebarClosed"] ? true : false;
		$("body").toggleClass("sidebar-closed", toggle);
		if(states.active_menu_id !== this.state.activeMenuId){
			this.setState({activeMenuId:states.active_menu_id});
		}
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	render: function() {
		return (
			<aside className="sidebar left">
				<div className="sidebar_content">
					<div className="sidebar-controls">
						{/*<Sidebar.Section data={{title:"My Apps", section:"apps", rows: this.state.apps}}/>*/}
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
			return <Sidebar.Row key={row.id} section={self.props.data.section} data={row} />
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
	mixins: [ Navigation ],

	clickedRow: function(){
		if(this.props.section === "apps")
			this.transitionTo('/app/' + this.props.data.manifest_id);
		else if(this.props.section === "groups"){
			this.transitionTo('/group/' + this.props.data.name + '/chat');
		}
		else if(this.props.section === "people"){
			this.transitionTo('/im/' + this.props.data.name + '/chat');
		}
	},
	render: function(){
		var className = "row ";
		if(this.props.data.hidden)
			className += "hidden ";
		if(this.props.data.unread_count)
			className += "unread ";
		if(this.props.data.id === stateStore.get("active_menu_id"))
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
