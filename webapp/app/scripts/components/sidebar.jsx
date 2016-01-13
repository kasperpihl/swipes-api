var React = require('react');
var Reflux = require('reflux');
var appStore = require('../stores/AppStore');
var stateStore = require('../stores/StateStore');
var userStore = require('../stores/UserStore');
var modalActions = require('../actions/ModalActions');
var overlayActions = require('../actions/OverlayActions');
var sidebarStore = require('../stores/SidebarStore');
var sidebarActions = require('../actions/SidebarActions');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Sidebar = React.createClass({
	mixins: [Reflux.ListenerMixin, appStore.connect("apps"), Navigation ],
	onStateChange: function(states){
		var toggle = states["sidebarClosed"] ? true : false;
		$("body").toggleClass("sidebar-closed", toggle);
		if(states.active_menu_id !== this.state.activeMenuId){
			this.setState({activeMenuId:states.active_menu_id});
		}
	},
	openServicesOverlay: function(){
		overlayActions.loadOverlay('services', {title: 'Services'});
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	render: function() {
		return (
			<aside className="sidebar left">
				<div className="sidebar_content">
					<div className="sidebar-controls">
						<Sidebar.Section data={{title:"My Workflows", section:"apps", rows: this.state.apps}}/>
						<div onClick={this.openServicesOverlay} style={{color: "white"}}>Open Services</div>
					</div>

				</div>
			</aside>
		);
	}
});
Sidebar.Section = React.createClass({
	onSectionHeader: function(){
		console.log(this.props.data.section);
		if(this.props.data.section === "apps"){
			sidebarActions.loadAppModal();
		}
	},
	render: function(){
		var self = this;
		var rows = this.props.data.rows.map(function(row){
			row.hidden = false;
			if(self.props.data.section === "apps"){
				if(!row.main_app || !row.is_active)
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
	},
	render: function(){
		var className = "row ";
		if(this.props.data.hidden)
			className += "hidden ";
		if(this.props.data.unread_count_display)
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
