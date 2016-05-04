var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var CreateTaskInput = require('./create_task_input');
var StatusesList = require('./statuses_list');
var Loading = require('./loading');
var ExpandedTask = require('./expanded_task');

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

			navName = navName;

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
  renderExpanedView: function (expandedTaskId) {
    return (
      <ExpandedTask taskId={expandedTaskId} />
    )
  },
	render: function () {
    var expandedTaskId = this.state.expandedTaskId;
		var commentsView = this.state.commentsView;

    return (
			<div className="height-100" style={{maxHeight: '100%', overflowY: 'auto'}}>
				{expandedTaskId ? (
					<div className="height-100">
						{this.renderExpanedView(expandedTaskId)}
					</div>
				) : (
					<div className="height-100">
						{this.renderStatuses()}
					</div>
				)}

				<CreateTaskInput expandedTaskId={expandedTaskId} commentsView={commentsView} />
			</div>
		)
	}
});

module.exports = Home;
