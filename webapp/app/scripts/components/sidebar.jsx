var React = require('react');
var Reflux = require('reflux');
var WorkflowStore = require('../stores/WorkflowStore');
var stateStore = require('../stores/StateStore');
var userStore = require('../stores/UserStore');
var modalActions = require('../actions/ModalActions');
var overlayActions = require('../actions/OverlayActions');
var sidebarStore = require('../stores/SidebarStore');
var sidebarActions = require('../actions/SidebarActions');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Sidebar = React.createClass({
	mixins: [Reflux.ListenerMixin, WorkflowStore.connect("workflows"), Navigation ],
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
						<Sidebar.Section data={{title:"My Workflows", rows: this.state.workflows}}/>
						<div onClick={this.openServicesOverlay} style={{color: "white"}}>Open Services</div>
					</div>

				</div>
			</aside>
		);
	}
});
Sidebar.Section = React.createClass({
	onSectionHeader: function(){
		sidebarActions.loadWorkflowModal();
	},
	render: function(){
		var self = this;
		var rows = this.props.data.rows.map(function(row){
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
	mixins: [ Navigation ],

	clickedRow: function(){
		if(this.props.data.id === stateStore.get("active_menu_id")){
			//this.setState({editMode:true});
		}
		else{
			this.transitionTo('/workflow/' + this.props.data.id);
		}
	},
	getInitialState:function(){
		return {};
	},
	renderNameOrInput:function(){
		if(this.state.editMode){
			return <input type="text" defaultValue={this.props.data.name} />;
		}
		else{
			return this.props.data.name;
		}
		
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
					{this.renderNameOrInput()}
				</div>
				<span className="notification chat">{this.props.data.unread_count_display}</span>
			</li>
		);
	}
});
module.exports = Sidebar;
