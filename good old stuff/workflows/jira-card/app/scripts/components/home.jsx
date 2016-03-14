var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var StatusesList = require('./statuses_list');
var ExpandedIssue = require('./expanded_issue');

function get_host(url) {
    return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
}

var Home = React.createClass({
	mixins: [MainStore.connect()],
  renderStatuses: function () {
    var settings = MainStore.get('settings');

    if (settings) {
      var projectKey = MainStore.get('settings').projectKey;
  		var project = MainStore.getAll()[projectKey];
  		var projectUrl = project ? get_host(project.self) + 'browse/' + projectKey : '#';

      swipes.navigation.setTitle(project.name);

      return (
        <StatusesList projectKey={projectKey} projectUrl={projectUrl} />
      )
    }
  },
  renderExpanedView: function (expandedIssueId) {
    return (
      <ExpandedIssue issueId={expandedIssueId} />
    )
  },
	render: function () {
    var expandedIssueId = this.state.expandedIssueId;

    return (
			<div>
				{expandedIssueId ? (
					<div>{this.renderExpanedView(expandedIssueId)}</div>
				) : (
					<div>{this.renderStatuses()}</div>
				)}
			</div>
		)
	}
});

module.exports = Home;
