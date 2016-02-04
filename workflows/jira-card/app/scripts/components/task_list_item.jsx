var React = require('react');
var Reflux = require('reflux');
var Paper = require('material-ui/lib').Paper;
var Avatar = require('material-ui/lib').Avatar;
var IconMenu = require('material-ui/lib').IconMenu;
var IconButton = require('material-ui/lib').IconButton;
var MenuItem = require('material-ui/lib').MenuItem;
var Colors = require('material-ui/lib/styles/colors');
var ProjectActions = require('../actions/ProjectActions');
;2
var TaskListItem = React.createClass({
	moreVertOnClick: function (options) {
		ProjectActions.transitionIssue(options);
	},
	moreVertMenuItems: function () {
		var self = this;
		var issue = this.props.data;
		var elements = issue.statuses.map(function (status, index) {
			if (status.id !== issue.fields.status.id) {
				var options = {
					issue: issue,
					status: status
				}
				return <MenuItem
								key={index}
								value={status.id}
								primaryText={status.name}
								onClick={self.moreVertOnClick.bind(self, options)}
							/>
			}
		});

		return elements;
	},
	children: function () {
		var data = this.props.data;
		var assignee = data.fields.assignee;
		var avatarUrl = assignee ? assignee.avatarUrls['48x48'] : '';
		var displayName = assignee ? assignee.displayName : 'Unassigned';

		return (
			<div>
				<Avatar src={avatarUrl} className="avatar-image" />
				<div className="title-container">
					<span className="title" title={data.fields.summary}>{data.fields.summary}</span>
					<span className="subtitle">{displayName}</span>
				</div>
				<div className="menu-container">
					<IconMenu
						iconButtonElement={<IconButton
																	iconClassName="material-icons person-add"
																	iconStyle={{
																		color: Colors.grey500
																	}}
																/>}
					>
						<MenuItem primaryText="I like to move it move it" />
					</IconMenu>
					<IconMenu
						iconButtonElement={<IconButton
																	iconClassName="material-icons more-vert"
																	iconStyle={{
																		color: Colors.grey500
																	}}
																/>}
					>
						{this.moreVertMenuItems()}
					</IconMenu>
				</div>
			</div>
		);
	},
	render: function () {
		return (
			<Paper className="card-container" children={this.children()} zDepth={1}/>
		);
	}
});


module.exports = TaskListItem;
