var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var WorkflowLoader = require('./workflow_loader');
var Loading = require('./loading');
var Modal = require('./modal');
var stateStore = require('../stores/StateStore');
var Home = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange: function (states) {
		if(states.isStarted !== this.state.isStarted) {
			this.setState({
				isStarted: states.isStarted
			});
		}
	},
	forwardParamsFromRouter: function(){
		if(this.props.params.workflowId){
			stateStore.actions.loadWorkflow(this.props.params);
		}
	},
	componentDidUpdate: function(){
		this.forwardParamsFromRouter();
	},
	componentWillMount:function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	componentDidMount:function(){
		// T_TODO: This causes trouble (stateStore get init twice!! Check redirect_flow.jsx as well for second place)
		console.log('mounted home and initing statestore');
		amplitude.logEvent('Session - Opened App');
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
					<div className="content-container" idName="main">
						<div className="workflow-view-controller">
							<Topbar data={{screen:1}}/>
							<WorkflowLoader data={{screen:1}}/>
						</div>
						<div className="workflow-view-controller">
							<Topbar data={{screen:2}}/>
							<WorkflowLoader data={{screen:2}} />
						</div>
						<div className="workflow-view-controller">
							<Topbar data={{screen:3}}/>
							<WorkflowLoader data={{screen:3}} />
						</div>
					</div>
				</div>
				<Modal />
			</div>
		);
	}
});

module.exports = Home;
