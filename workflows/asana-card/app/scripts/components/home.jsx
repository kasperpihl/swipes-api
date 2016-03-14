var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');
var StatusesList = require('./statuses_list');
var Loading = require('./loading');
var FontIcon = require('material-ui/lib/font-icon');
var CircularProgress = require('material-ui/lib/circular-progress');
var classNames = require('classnames');
//var ExpandedIssue = require('./expanded_issue');

var Home = React.createClass({
	mixins: [MainStore.connect()],
	inputOnChange: function() {
    var input = this.refs.input;
		var newValue = input.value;

		MainActions.changeInputValue(newValue);
  },
	createTask: function () {
		ProjectActions.createTask({
			name: this.state.createInputValue
		})
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
        <StatusesList projectId={projectId} />
      )
    } else {
			return (
        <Loading />
      )
		}
  },
  onKeyDown: function(e){
  	if(e.keyCode === 13){
  		this.createTask();
  	}
  },
	renderInput: function() {
		var inputLength = this.state.createInputValue.length;
		var inputWrapperClass = classNames({
			'todo-input': true,
			// Kris_TODO make it with only active class
			'active': inputLength > 0,
			'inactive': inputLength <= 0
		});
		var addIconClass = classNames({
			'task-add-icon': true,
			// Kris_TODO make it with only active class
			'active': inputLength > 0,
			'inactive': inputLength <= 0
		});

		return (
			<div className={inputWrapperClass}>
				<input
					id="create-task-input"
					ref="input"
					type="text"
					value={this.state.createInputValue}
					onKeyDown={this.onKeyDown}
					disabled={this.state.disabledInput}
					placeholder="Create a new task"
					onChange={this.inputOnChange} />

				<div className={addIconClass} onClick={this.createTask}>
					<FontIcon color="#fff" className="material-icons">add</FontIcon>
				</div>

				<div className={"new-task-loader " + this.state.creatTaskLoader}>
					<CircularProgress size={0.5} color="#777" />
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
      <div style={{maxHeight: '100%', overflowY: 'auto'}}>
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
