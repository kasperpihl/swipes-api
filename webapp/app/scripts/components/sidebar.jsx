var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = require('react-router').Link;
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var Colors = require('material-ui/lib/styles/colors');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var injectTapEventPlugin = require("react-tap-event-plugin");
var WorkflowStore = require('../stores/WorkflowStore');
var stateStore = require('../stores/StateStore');
var userStore = require('../stores/UserStore');
var modalActions = require('../actions/ModalActions');
var overlayActions = require('../actions/OverlayActions');
var sidebarStore = require('../stores/SidebarStore');
var sidebarActions = require('../actions/SidebarActions');
injectTapEventPlugin();

var Sidebar = React.createClass({
	mixins: [Reflux.ListenerMixin, WorkflowStore.connect("workflows")],
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	onStateChange: function(states){
		var toggle = states["sidebarClosed"] ? true : false;
		$("body").toggleClass("sidebar-closed", toggle);
		if(states.active_menu_id !== this.state.activeMenuId){
			this.setState({activeMenuId:states.active_menu_id});
		}
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
			stateStore.unset("swipesToken", {trigger: false});
      localStorage.clear();
			amplitude.setUserId(null); // Log out user from analytics
      this.context.router.push('/login');
    },
    profile: function() {
        var button = (
            <IconButton touch={true}>
                <MoreVertIcon color={Colors.grey50} />
            </IconButton>
        );
        return  <div className="profile-wrapper">
                    <div className="profile-image">{userStore.me().name.charAt(0)}</div>
                    <div className="username">{userStore.me().name}</div>
                    <IconMenu
                        iconButtonElement={button}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}} >
                        <MenuItem primaryText="Sign out" onClick={this.logOut} />
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
                        <div className="sidebar-actions">
                          <div className="sidebar-action add-workflow" onClick={this.openWorkflowModal} data-description="Add a Workflow">

                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                              <g>
                                <circle cx="16" cy="16" r="15" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line x1="10.7" y1="21.3" x2="21.3" y2="10.7" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line x1="17.06" y1="22.36" x2="22.36" y2="17.06" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line x1="9.64" y1="14.94" x2="14.94" y2="9.64" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                              </g>
                            </svg>

                          </div>
													<Link to="/services" className="sidebar-action open-services" data-description="Open Services">

                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                              <g>
                                <g>
                                  <circle cx="16" cy="16" r="3.75" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                  <path d="M1860-3186.75a15,15,0,0,1-15-15,15,15,0,0,1,15-15,15,15,0,0,1,15,15" transform="translate(-1844 3217.75)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </g>
                                <g>
                                  <path d="M1875-3201.75q0,0.5,0,1" transform="translate(-1844 3217.75)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                  <path d="M1874.2-3196.91a15,15,0,0,1-11.27,9.88" transform="translate(-1844 3217.75)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke-dasharray="1.96 3.92"/>
                                  <path d="M1861-3186.78q-0.5,0-1,0" transform="translate(-1844 3217.75)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </g>
                              </g>
                            </svg>

                          </Link>
                        </div>
					</div>

				</div>
			</aside>
		);
	}
});
Sidebar.Row = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	clickedRow: function(){
		if(this.props.data.id === stateStore.get("active_menu_id")){
			//this.setState({editMode:true});
		}
		else{
			this.context.router.push('/workflow/' + this.props.data.id);
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
