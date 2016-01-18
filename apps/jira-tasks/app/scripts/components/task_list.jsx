var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var TaskListItem = require('./task_list_item');
var TaskItem = require('./task_item');
var TaskList = React.createClass({
	mixins: [IssueStore.connect('issues')],
	clickedIssue: function(issueId){
		console.log('clicked');
		this.setState({issueId: issueId});
	},
	clickedGoBack: function(){
		this.setState({issueId: null});
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
				<div className="task-list">
					{this.renderIssues()}
				</div>
			</div>
		);
	}
});


module.exports = TaskList;