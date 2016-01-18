var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var IssueActions = require('../actions/IssueActions');
var TaskListItem = require('./task_list_item');
var TaskItem = require('./task_item');
var TaskList = React.createClass({
	mixins: [IssueStore.connect('issues')],
	clickedIssue: function(issueId){

		console.log('clicked');
		IssueActions.workOnIssue(issueId);
	},
	clickedGoBack: function(issueId){
		IssueActions.stopWorkOnIssue(issueId);
	},
	renderHeader:function(){

	},
	renderIssues: function(){
		var self = this;
		if(!this.state.issueId){
			return this.state.issues.map(function(issue){
				return <TaskListItem data={issue} key={issue.id} onClickHandler={self.clickedIssue} />
			});
		}
		else{
			return <TaskItem id={this.state.issueId} onClickHandler={self.clickedGoBack} />
		}
	},
	render: function() {
		return (
			<div ref="scroll-container" className="task-list-container">
				{this.renderHeader()}
				<div className="task-list">
					{this.renderIssues()}
				</div>
			</div>
		);
	}
});


module.exports = TaskList;