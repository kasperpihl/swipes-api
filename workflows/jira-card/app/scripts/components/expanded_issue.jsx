var React = require('react');
var Reflux = require('reflux');
var Card = require('material-ui/lib').Card;
var CardText = require('material-ui/lib').CardText;
var CardHeader = require('material-ui/lib').CardHeader;
var CardActions = require('material-ui/lib').CardActions;
var CardMedia = require('material-ui/lib').CardMedia;
var Divider = require('material-ui/lib').Divider;
var CardTitle = require('material-ui/lib').CardTitle;
var RaisedButton = require('material-ui/lib').RaisedButton;
var MainActions = require('../actions/MainActions');

var ExpandedIssue = React.createClass({
  getInitialState: function () {
		return {
			issue: null
		}
	},
  componentDidMount: function () {
    var self = this;

    // T_TODO I already have the issues... I just need to pass the right one in that component.
    // I don't need one more rest query.
    swipes.service('jira').request('issue.getIssue', {issueId: this.props.issueId}, function (res,err) {
      console.log(res.data);
			self.setState({
        issue: res.data
				// comments: res.data.fields.comment.comments,
				// attachments: res.data.fields.attachment
			});
		});
	},
  renderDescription: function () {
		if(this.state.issue.fields.description){
			return (
				<CardText>
					{this.state.issue.fields.description}
				</CardText>
			);
		} else {
      return (
				<CardText>
					No description available.
				</CardText>
			);
    }
	},
  renderAttachments: function () {
    var issue = this.state.issue;
    var attachments = issue.fields.attachment;

    if(attachments.length > 0) {
			return attachments.map(function (attachment) {
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
		} else {
      return (
				<CardText>
					There are no attachments.
				</CardText>
			);
    }
  },
  renderComments: function () {
    var issue = this.state.issue;
    var comments = issue.fields.comment.comments;

    if(comments.length > 0) {
			return comments.map(function (comment) {
				return (
					<CardHeader
						key={comment.id}
						title={comment.author.name + ' wrote:'}
						subtitle={comment.body} />
				)
			});
		} else {
      return (
				<CardText>
					There are no comments yet.
				</CardText>
			);
    }
  },
  goBack: function () {
    MainActions.expandIssue(null);
  },
	render: function () {
    var issue = this.state.issue;
    var assignee;
    var avatarUrl;
    var displayName;

    if (issue) {
      assignee = issue.fields.assignee;
  		avatarUrl = assignee ? assignee.avatarUrls['48x48'] : '';
  		displayName = assignee ? assignee.displayName : 'Unassigned';
    }

		return (
      <div>
				{issue ? (
					<div>
            <Card>
    					<CardHeader
                title={issue.fields.summary}
    						subtitle={displayName}
                avatar={avatarUrl}
              />
    					{this.renderDescription()}
    					{this.renderAttachments()}
    					{this.renderComments()}
              <CardActions>
    						<RaisedButton label="Go back" primary={true} onClick={this.goBack} />
    					</CardActions>
    				</Card>
					</div>
				) : (
					<div>Loading...</div>
				)}
			</div>
		);
	}
});

module.exports = ExpandedIssue;
