var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var AppLoader = require('./app_loader');
var Loading = require('./loading');

var Router = require('react-router');
var stateStore = require('../stores/StateStore');
var Navigation = Router.Navigation;
var Home = React.createClass({
	mixins: [ Navigation, Reflux.ListenerMixin ],
	onStateChange: function(states){
		if(!states.isLoggedIn){
			localStorage.clear();
			return this.transitionTo('/login');
		}
		var newStates = {};
		if(!this.state.isLoggedIn)
			newStates.isLoggedIn = true;
		if(states.isStarted !== this.state.isStarted)
			newStates.isStarted = states.isStarted;
		if(_.size(newStates) > 0){
			this.setState(newStates);
		}

	},
	forwardParamsFromRouter: function(){
		stateStore.actions.loadApp(this.props.params);
	},
	componentDidUpdate: function(){
		this.forwardParamsFromRouter();
	},
	componentWillMount:function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	componentDidMount:function(){
		stateStore.actions.init();
		this.forwardParamsFromRouter();

	},
	getInitialState: function(){
		return {};
	},
	render: function() {
		if(!this.state.isStarted){
			return ( <Loading /> );
		}
		return (
			<div className="main">
				<Sidebar />
				<div className="right-side-container">
					<div className="dual-apps content-container" idName="main">
						<div className="app-view-controller">
							<Topbar data={{screen:1}}/>
							<AppLoader data={{screen:1}}/>
						</div> 
						<div className="app-view-controller">
							<Topbar data={{screen:2}}/>
							<AppLoader data={{screen:2}} />
						</div>
						<div className="app-view-controller">
							<Topbar data={{screen:3}}/>
							<AppLoader data={{screen:3}} />
						</div> 
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Home;
