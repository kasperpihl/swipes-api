var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var UserStore = require('../stores/UserStore');
var IssueActions = require('../actions/IssueActions');
var TaskListItem = require('./task_list_item');
var TaskItem = require('./task_item');
var TaskList = React.createClass({
	mixins: [IssueStore.connect('issues')],
	componentDidMount: function(){
		IssueStore.fetch();
		UserStore.fetch();
	},
	clickedIssue: function(issueId){
		console.log('clicked');
		IssueActions.workOnIssue(issueId);
	},
	clickedGoBack: function(issueId){
		IssueActions.stopWorkOnIssue(issueId);
	},
	renderHeader:function(currentIssue){
		if(currentIssue){
			return <h3>You are currently working on this task</h3>
		}
		else{
			return <h3>Which task do you want to work on?</h3>
		}
	},
	renderIssues: function(currentIssue){
		var self = this;
		
		console.log('current', currentIssue);
		if(!currentIssue){
			return this.state.issues.map(function(issue){
				return <TaskListItem data={issue} key={issue.id} onClickHandler={self.clickedIssue} />
			});
		}
		else{
			return <TaskItem id={currentIssue.id} onClickHandler={self.clickedGoBack} />
		}
	},
	render: function() {
		var currentIssue = IssueStore.getCurrentIssue();
		return (
			<div ref="scroll-container" className="task-list-container">
				<div className="task-list">
					{this.renderHeader(currentIssue)}
					{this.renderIssues(currentIssue)}
				</div>
			</div>
		);
	}
});


module.exports = TaskList;