var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var StatusesList = require('./statuses_list');
var Loading = require('./loading');
var FontIcon = require('material-ui/lib/font-icon');
//var ExpandedIssue = require('./expanded_issue');

// function get_host(url) {
//     return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
// }

var Home = React.createClass({
	mixins: [MainStore.connect()],
	addActions: function() {
    var input = this.refs.input;

    if (input.value.length > 0) {
			MainActions.changeState({
				addNewTaskIcon: 'active',
				todoInput: 'active'
			})
    } else {
			MainActions.changeState({
				addNewTaskIcon: 'inactive',
				todoInput: 'inactive'
			})
    }
  },
  renderStatuses: function () {
    var settings = MainStore.get('settings');

    if (settings) {
      var workspaceId = settings.workspaceId;
			var projectId = settings.projectId;
  		var workspace = MainStore.getAll()[workspaceId];
			var projects = workspace.projects;
			var navName = '';

			projects.forEach(function (project) {
				if (project.id.toString() === projectId) {
					navName = project.name;
				}
			})

			navName = navName + ' - ' + workspace.name;

      swipes.navigation.setTitle(navName);

      return (
        //<StatusesList projectKey={projectKey} projectUrl={projectUrl} />
        <StatusesList projectId={projectId} />
      )
    } else {
			return (
        <Loading />
      )
		}
  },
	renderInput: function() {
		return (
			<div className={"todo-input " + this.state.todoInput}>
				<input ref="input" type="text" placeholder="Create a new task" onChange={this.addActions} />
				<div className={"task-add-icon " + this.state.addNewTaskIcon}>
					<FontIcon color="#fff" className="material-icons">add</FontIcon>
				</div>
			</div>
		)
	},
  // renderExpanedView: function (expandedIssueId) {
  //   return (
  //     <ExpandedIssue issueId={expandedIssueId} />
  //   )
  //},
	render: function () {
    //var expandedIssueId = this.state.expandedIssueId;

    return (
      <div>
        {this.renderStatuses()}
				{this.renderInput()}
      </div>
    );
    // return (
		// 	<div>
		// 		{expandedIssueId ? (
		// 			<div>{this.renderExpanedView(expandedIssueId)}</div>
		// 		) : (
		// 			<div>{this.renderStatuses()}</div>
		// 		)}
		// 	</div>
		// )
	}
});

module.exports = Home;
