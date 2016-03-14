var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var CreateTaskInput = require('./create_task_input');
var StatusesList = require('./statuses_list');
var Loading = require('./loading');
//var ExpandedIssue = require('./expanded_issue');

var Home = React.createClass({
	mixins: [MainStore.connect()],
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
        <StatusesList projectId={projectId} />
      )
    } else {
			return (
        <Loading />
      )
		}
  },
  // renderExpanedView: function (expandedIssueId) {
  //   return (
  //     <ExpandedIssue issueId={expandedIssueId} />
  //   )
  //},
	render: function () {
    //var expandedIssueId = this.state.expandedIssueId;

    return (
      <div style={{maxHeight: '100%', overflowY: 'auto'}}>
        {this.renderStatuses()}
				<CreateTaskInput />
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
