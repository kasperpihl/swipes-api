var React = require('react');
var classNames = require('classnames');
var FontIcon = require('material-ui/lib/font-icon');
var CircularProgress = require('material-ui/lib/circular-progress');
var ProjectDataActions = require('../actions/ProjectDataActions');
var CreateTaskInputStore = require('../stores/CreateTaskInputStore');
var CreateTaskInputActions = require('../actions/CreateTaskInputActions');

var CreateTaskInput = React.createClass({
	mixins: [CreateTaskInputStore.connect()],
	inputOnChange: function(e) {
		CreateTaskInputActions.changeInputValue(e.target.value);
  },
	createTask: function () {
		var expandedTaskId = this.props.expandedTaskId;
		var subtask = expandedTaskId ? true : false;
		var task = {
			name: this.state.inputValue,
			subtask: subtask
		}

		if (subtask) {
			task.parent = expandedTaskId
		}

		ProjectDataActions.createTask(task, subtask);
	},
  onKeyDown: function(e){
  	if(e.keyCode === 13){
  		this.createTask();
  	}
  },
	render: function () {
    var inputLength = this.state.inputValue.length;
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
		var placeholder = this.props.expandedTaskId ?
										'Create a new subtask' :
										'Create a new task'

		return (
			<div className={inputWrapperClass}>
				<input
					id="create-task-input"
					ref="input"
					type="text"
					value={this.state.inputValue}
					onKeyDown={this.onKeyDown}
					disabled={this.state.disabledInput}
					placeholder={placeholder}
					onChange={this.inputOnChange} />

				<div className={addIconClass} onClick={this.createTask}>
					<FontIcon color="#fff" className="material-icons">add</FontIcon>
				</div>

				<div className={"new-task-loader " + this.state.creatTaskLoader}>
					<CircularProgress size={0.5} color="#777" />
				</div>
			</div>
		)
	}
});

module.exports = CreateTaskInput;
