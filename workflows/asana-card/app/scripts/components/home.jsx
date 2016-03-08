var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var StatusesList = require('./statuses_list');
var Loading = require('./loading');
//var ExpandedIssue = require('./expanded_issue');

// function get_host(url) {
//     return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
// }

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
        //<StatusesList projectKey={projectKey} projectUrl={projectUrl} />
        <StatusesList workspaceId={workspaceId} />
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
      <div>
        {this.renderStatuses()}
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
