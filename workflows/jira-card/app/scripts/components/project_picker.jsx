var React = require('react');
var Reflux = require('reflux');
var SelectField = require('material-ui/lib').SelectField;
var MenuItem = require('material-ui/lib').MenuItem;
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var StatusesList = require('./statuses_list');
var ExpandedIssue = require('./expanded_issue');

var _indexByProjectKeys = {};

function get_host(url) {
    return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
}

var ProjectPicker = React.createClass({
	mixins: [MainStore.connect()],
	getInitialState: function () {
		return {
			value: null,
			floatingLabelText: 'Loading...',
			items: [],
      expandedIssueId: null
		}
	},
	componentDidMount: function () {
		var self = this;

		swipes.service('jira').request('project.getAllProjects', function (res, err) {
			if (res) {
				_indexByProjectKeys = _.indexBy(res.data, 'key');
				var items = res.data.map( function (project, idx) {
					return <MenuItem key={idx} value={project.key} primaryText={project.name} />
				});

				self.setState(
					{
						items: items,
						floatingLabelText: 'Select Project',
						value: self.state.settings.projectKey ?
										self.state.settings.projectKey :
										null
					}
				);
			}
			else {
				console.log(err);
			}
		})
	},
  handleChange: function (e, index, value) {
		var value = value || null;

		ProjectActions.reset();
		MainActions.updateSettings({projectKey: value});
		this.setState({value: value});
	},
  renderStatuses: function () {
    var projectKey = this.state.value;
		var project = _indexByProjectKeys[projectKey];
		var projectUrl = project ? get_host(project.self) + 'browse/' + projectKey : '#';

    return (
      <div>
				<SelectField
					value={projectKey}
					onChange={this.handleChange}
					fullWidth={true}
					autoWidth={true}
					floatingLabelText={this.state.floatingLabelText}
				>
					{this.state.items}
				</SelectField>

				<StatusesList projectKey={projectKey} projectUrl={projectUrl} />
			</div>
    )
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

module.exports = ProjectPicker;
