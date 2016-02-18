var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var TextField = require('material-ui/lib').TextField;
var RaisedButton = require('material-ui/lib').RaisedButton;

var commonStyles = {
  width: '100%'
}

var Home = React.createClass({
	mixins: [MainStore.connect()],
  createIssue: function () {
    var projectKey = MainStore.get('settings').projectKey;
    var project = MainStore.getAll()[projectKey];
    var issueTitle = this.refs.issueTitle.props.value;
    var issueDescription = this.refs.issueDescription.props.value;
    var issue = {
      fields: {
        project: {
          id: project.id
        },
        issuetype: {
            id: "10002" // Task
        },
        priority: {
             id: "3" // Medium
         },
        summary: issueTitle,
        description: issueDescription
      }
    };

    MainActions.createIssue(issue, this.refs);
  },
  handleInputChange: function (e) {
    var inputType = e.target.name;

    MainActions.updateInputValue(inputType, e.target.value);
  },
	render: function () {
    return (
			<div>
        <TextField
          defaultValue={''}
          value={this.state.issueTitle.value}
          name="issueTitle"
          ref="issueTitle"
          floatingLabelText="Issue title"
          style={commonStyles}
          onChange={this.handleInputChange}
        />
        <TextField
          defaultValue={''}
          value={this.state.issueDescription.value}
          name="issueDescription"
          ref="issueDescription"
          floatingLabelText="Issue description"
          multiLine={true}
          rowsMax={6}
          style={commonStyles}
          onChange={this.handleInputChange}
        />
        <RaisedButton label="Create Issue" primary={true} style={commonStyles} onClick={this.createIssue} disabled={this.state.button.disabled} />
			</div>
		)
	}
});

module.exports = Home;
