/*
	This is the edit view for an issue / check tasklistitem.jsx for the list item view
 */
var React = require('react');
var Reflux = require('reflux');
var Card = require('material-ui/lib').Card;
var CardText = require('material-ui/lib').CardText;
var CardHeader = require('material-ui/lib').CardHeader;
var CardActions = require('material-ui/lib').CardActions;
var TextField = require('material-ui/lib').TextField;
var RaisedButton = require('material-ui/lib').RaisedButton;
var IssueStore = require('../stores/IssueStore');
var IssueActions = require('../actions/IssueActions');
var TaskItem = React.createClass({
	mixins: [IssueStore.connectFilter('issue', function(issues){
		return issues.filter(function(issue) {
           return issue.id === this.props.id;
        }.bind(this))[0];
	})],
	onCompleteWork: function(){
		IssueActions.completeWorkOnIssue(this.props.id);
	},
	onStopWorking: function(){
		swipes.modal.confirm('Stop working on Issue?', 'Do you want to stop working on this issue and move it back to ToDo?', function(confirmed){
			if(confirmed){
				IssueActions.stopWorkOnIssue(this.props.id);
			}
		}.bind(this));
		
	},
	renderSummary: function(){
		return <div className="task-summary">{this.state.issue.fields.summary}</div>
	},
	renderAssignee: function(){

	},
	renderSubtasks: function(){

	},
	componentDidMount: function(){
		swipes.service('jira').request('issue.getIssue', {issueId: this.props.id}, function(res,err){
			console.log('getIssue', res, err);
		});
	},
	onNoteExpand:function(expanded){
		console.log('changed exp', expanded);
		if(expanded){
			var self = this;
			// Hack to focus on field,
			// Skip a cyclus to get the field rendered from the expand 
			setTimeout(function(){
				self.refs['notes-field'].focus();
			}, 0);
			
			//this.refs['notes-field'].focus();
		}
	},
	render: function() {
		console.log(this.state.issue);
		return (
			<div>
				<Card className="card-container">
					<CardHeader title={this.state.issue.fields.summary}
						subtitle={this.state.issue.fields.description} />
					<CardActions>
						<RaisedButton onClick={this.onStopWorking} label="Stop working"/>
						<RaisedButton onClick={this.onCompleteWork} label="Complete" secondary={true}/>
					</CardActions>
				</Card>
				<Card onExpandChange={this.onNoteExpand} className="card-container">
					<CardHeader
						title="Personal Notes" 
						subtitle="Here you can write all your thoughts" 
						actAsExpander={true}
						showExpandableButton={true} />
					<CardText onExpandChange={this.onNoteExpand} expandable={true}>
						<TextField 
							fullWidth={true}
							style={{fontSize: '14px'}}
							ref="notes-field"
							expandable={true}
							hintText="Enter your notes here"
							multiLine={true} />
					</CardText>
				</Card>
				<Card className="card-container">
					<CardActions>
						<RaisedButton onClick={this.onCompleteWork} label="Complete" secondary={true}/>
					</CardActions>
				</Card>
			</div>
		);
	}
});


module.exports = TaskItem;