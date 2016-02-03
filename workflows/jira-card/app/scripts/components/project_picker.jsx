var React = require('react');
var Reflux = require('reflux');
var SelectField = require('material-ui/lib').SelectField;
var MenuItem = require('material-ui/lib').MenuItem;
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var StatusesList = require('./statuses_list');

var ProjectPicker = React.createClass({
	mixins: [MainStore.connect()],
	handleChange: function (e, index, value) {
		var value = value || null;

		ProjectActions.reset();
		MainActions.updateSettings({projectKey: value});
		this.setState({value: value});
	},
	getInitialState: function () {
		return {
			value: null,
			floatingLabelText: 'Loading...',
			items: []
		}
	},
	componentDidMount: function () {
		var self = this;

		swipes.service('jira').request('project.getAllProjects', function (res, err) {
			if (res) {
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
	render: function () {
		return (
			<div>
				<SelectField
					value={this.state.value}
					onChange={this.handleChange}
					fullWidth={true}
					autoWidth={true}
					floatingLabelText={this.state.floatingLabelText}
				>
					{this.state.items}
				</SelectField>

				<StatusesList projectKey={this.state.value} />
			</div>
		)
	}
});

module.exports = ProjectPicker;
