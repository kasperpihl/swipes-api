var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var WorkflowLoader = require('./workflow_loader');
var Modal = require('./modal');
var stateStore = require('../stores/StateStore');
var Home = React.createClass({
	forwardParamsFromRouter: function () {
		if (this.props.params.workflowId) {
			stateStore.actions.loadWorkflow(this.props.params);
		}
	},
	componentDidUpdate: function () {
		this.forwardParamsFromRouter();
	},
	componentDidMount:function () {
		console.log('mounted home');
		amplitude.logEvent('Session - Opened App');
		this.forwardParamsFromRouter();

	},
	getInitialState: function () {
		return {};
	},
	render: function () {
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
