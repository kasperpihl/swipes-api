/*
	This is the edit view for an issue / check tasklistitem.jsx for the list item view
 */
var React = require('react');
var Reflux = require('reflux');
var Card = require('material-ui/lib').Card;
var CardText = require('material-ui/lib').CardText;
var CardHeader = require('material-ui/lib').CardHeader;
var CardActions = require('material-ui/lib').CardActions;
var CardMedia = require('material-ui/lib').CardMedia;
var CardTitle = require('material-ui/lib').CardTitle;
var TextField = require('material-ui/lib').TextField;
var FlatButton = require('material-ui/lib').FlatButton;
var UserStore = require('../stores/UserStore');
var IssueStore = require('../stores/IssueStore');
var IssueActions = require('../actions/IssueActions');
var TaskItem = React.createClass({
	mixins: [IssueStore.connectFilter('issue', function(issues){
		return issues.filter(function(issue) {
			return issue.id === this.props.id;
		}.bind(this))[0];
	})],
	onCompleteWork: function(){
		swipes.modal.confirm('Complete Issue', 'Complete this issue and move it to Done in JIRA?', function(confirmed){
			if(confirmed){
				IssueActions.completeWorkOnIssue(this.props.id);
			}
		}.bind(this));
		
	},
	onStopWorking: function(){
		swipes.modal.confirm('Stop working on Issue', 'Stop working on this issue and move it back to ToDo in JIRA?', function(confirmed){
			if(confirmed){
				IssueActions.stopWorkOnIssue(this.props.id);
			}
		}.bind(this));
		
	},
	onAssignAnotherPerson: function(){
		var rows = _.sortBy(UserStore.getAll(), 'name').map(function(user){
			user.id = user.key;
			return user;
		})
		var self = this;
		swipes.modal.load("list", {"title": "Assign a person", "emptyText": "No people to assign. You'll have to do it yourself.", "rows": rows }, function(row){
			if(row){
				swipes.modal.confirm('Assign ' + row.name + ' to this issue?', 'Assign ' + row.name + ' to this issue and move it back to ToDo in JIRA?', function(confirmed){
					if(confirmed){
						IssueActions.assignPersonToIssue(self.props.id, row);
					}
				});
			}
		});
		
		
	},
	
	componentDidMount: function(){
		swipes.service('jira').request('issue.getIssue', {issueId: this.props.id}, function(res,err){
			console.log('getIssue', res.data.fields.comment.comments, err);
			this.setState({
				comments: res.data.fields.comment.comments,
				attachments: res.data.fields.attachment
			});
		}.bind(this));
	},
	onNoteExpand:function(expanded){
		if(expanded){
			var self = this;
			// Hack to focus on field,
			// Skip a cyclus to get the field rendered from the expand 
			setTimeout(function(){
				self.refs['notes-field'].focus();
			}, 0);
		}
	},
	renderAttachments: function(){
		if(this.state.attachments){
			console.log('tachnent', this.state.attachments);
			return this.state.attachments.map(function(attachment){
				return (
					<CardMedia 
						style={{
							height: 200,
							width: 200,
							margin: 20,
							textAlign: 'center',
							display: 'inline-block'
						}}
						key={attachment.id} 
						expandable={true}
						overlayContentStyle={{
							paddingTop: 0
						}}
						overlay={<CardTitle 
							style={{
								padding: '5px',
								paddingTop: 0 
							}}
							titleStyle={{
								fontSize: '14px',
								lineHeight: '24px'
							}}
							subtitleStyle={{
								fontSize: '12px'
							}}
							title={attachment.author.name + ' uploaded:'} 
							subtitle={attachment.filename}/>
						}>
						<img src={attachment.thumbnail} />
					</CardMedia>
				);
			});
		}
	},
	renderComments: function(){
		if(this.state.comments){
			return this.state.comments.map(function(comment){
				return (
					<CardHeader 
						expandable={true}
						key={comment.id}
						title={comment.author.name + ' wrote:'}
						subtitle={comment.body} />
				)
			});
		}
	},
	render: function() {
		return (
			<div>
				<Card className="card-container">
					<CardHeader title={this.state.issue.fields.summary}
						subtitle={this.state.issue.fields.status.name} />
				</Card>
				<Card className="card-container">
					<CardActions>
						<FlatButton onClick={this.onStopWorking} label="Stop working on this issue" primary={true}/>
						<FlatButton onClick={this.onAssignAnotherPerson} label="Assign next person"/>
						<FlatButton onClick={this.onCompleteWork} label="Complete" secondary={true}/>
					</CardActions>
				</Card>
				<Card className="card-container">
					<CardHeader
						title="Issue details"
						subtitle={this.state.issue.fields.description}
						showExpandableButton={true}
						actAsExpander={true}/>
					{this.renderAttachments()}
					{this.renderComments()}
				</Card>
			</div>
		);
	}
});


module.exports = TaskItem;