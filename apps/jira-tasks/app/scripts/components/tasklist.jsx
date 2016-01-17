var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var TaskItem = require('./taskitem');
var TaskList = React.createClass({
	mixins: [IssueStore.connect('issues')],
	renderIssues: function(){
		return this.state.issues.map(function(issue){
			return <TaskItem data={issue} key={issue.id} />
		});
	},
	render: function() {
		console.log('render', this.state);
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