var React = require('react');
var Reflux = require('reflux');
var WorkflowStore = require('../stores/WorkflowStore');
var stateStore = require('../stores/StateStore');
var userStore = require('../stores/UserStore');
var modalActions = require('../actions/ModalActions');
var overlayActions = require('../actions/OverlayActions');
var sidebarStore = require('../stores/SidebarStore');
var sidebarActions = require('../actions/SidebarActions');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var Colors = require('material-ui/lib/styles/colors');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

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
    componentDidMount:function() {
		$(document).ready(function() {
			$.swContextMenu();
		})
	},
	openServicesOverlay: function(){
		overlayActions.loadOverlay('services', {title: 'Services'});
	},
	openWorkflowModal: function(){
		sidebarActions.loadWorkflowModal();
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	renderWorkflows: function(){
		var rows = this.state.workflows.map(function(row){
			return <Sidebar.Row key={row.id} data={row} />
		});
		return (
			<ul className="rows">
				{rows}
			</ul>
		);
	},
    logOut: function() {
      localStorage.clear();
      window.location.reload();  //Did not manage to use routes
    },
    profile: function() {
        var button = (
            <IconButton touch={true}>
                <MoreVertIcon color={Colors.grey400} />
            </IconButton>
        );
        return  <div className="profile-wrapper">
                    <div className="profile-image">{userStore.me().name.charAt(0)}</div>
                    <div className="username">{userStore.me().name}</div>
                    <IconMenu 
                        iconButtonElement={button} 
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}} >
                        <MenuItem primaryText="Sign out" />
                    </IconMenu>
                </div> 
    },
	render: function() {
		return (
			<aside className="sidebar left">
				<div className="sidebar_content">
					<div className="sidebar-controls">
                        {this.profile()}
						{this.renderWorkflows()}
						<div onClick={this.openWorkflowModal}>Add Workflow</div>
						<div onClick={this.openServicesOverlay} style={{color: "white"}}>Open Services</div>
					</div>

				</div>
			</aside>
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
