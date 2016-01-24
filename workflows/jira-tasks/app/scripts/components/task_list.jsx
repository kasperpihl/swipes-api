var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var UserStore = require('../stores/UserStore');
var NotificationStore = require('../stores/NotificationStore');
var NotificationActions = require('../actions/NotificationActions');
var IssueActions = require('../actions/IssueActions');
var TaskListItem = require('./task_list_item');
var Snackbar = require('material-ui/lib').Snackbar;
var TaskItem = require('./task_item');
var TaskList = React.createClass({
	mixins: [IssueStore.connect('issues'), NotificationStore.connect('notifications')],
	componentDidMount: function(){
		IssueStore.fetch();
		UserStore.fetch();
	},
	clickedIssue: function(issue){
		swipes.modal.confirm(issue.fields.summary, 'Do you want to start working on this issue?', function(res){
			if(res){
				IssueActions.workOnIssue(issue.id);
			}
		})
		
	},
	renderHeader:function(currentIssue){
		if(currentIssue){
			return (
				<div>
					<h3>You are currently working on this issue:</h3>

				</div>
			)
		}
		else{
			return (
				<div>
					<h3>This is your issues in the current Sprint of JIRA</h3>
					Select a task to work on.
				</div>
			);
		}
	},
	renderIssues: function(currentIssue){
		var self = this;
		if(!currentIssue){
			return this.state.issues.map(function(issue){
				return <TaskListItem data={issue} key={issue.id} onClickHandler={self.clickedIssue} />
			});
		}
		else{
			return <TaskItem id={currentIssue.id} />
		}
	},
	renderNotification: function(){
		console.log('rend notif', this.state.notifications);
		var open = false;
		var message = "";
		var duration = 3000;
		if(this.state.notifications.messages && this.state.notifications.messages.length){
			var notification = this.state.notifications.messages[0];
			open = true;
			message = notification.message;
			if(notification.duration){
				duration = notification.duration;
			}
		}
		return <Snackbar 
			open={open}
			message={message}
			action="close"
			autoHideDuration={duration}
			onRequestClose={NotificationActions.popNotification}
			onActionTouchTap={NotificationActions.popNotification}/>;

	},
	render: function() {

		var currentIssue = IssueStore.getCurrentIssue();
		return (
			<div ref="scroll-container" className="task-list-container">
				<div className="task-list">
					{this.renderHeader(currentIssue)}
					{this.renderIssues(currentIssue)}
				</div>
				{this.renderNotification()}
				
			</div>
		);
	}
});


module.exports = TaskList;