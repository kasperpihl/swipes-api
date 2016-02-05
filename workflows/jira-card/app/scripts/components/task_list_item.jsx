var React = require('react');
var Reflux = require('reflux');
var Paper = require('material-ui/lib').Paper;
var Avatar = require('material-ui/lib').Avatar;
var IconMenu = require('material-ui/lib').IconMenu;
var IconButton = require('material-ui/lib').IconButton;
var MenuItem = require('material-ui/lib').MenuItem;
var Colors = require('material-ui/lib/styles/colors');
var UserStore = require('../stores/UserStore');
var ProjectActions = require('../actions/ProjectActions');

var TaskListItem = React.createClass({
	moreVertOnClick: function (options) {
		ProjectActions.transitionIssue(options);
	},
	personAddOnClick: function (options) {
		ProjectActions.assignPerson(options);
	},
	personAddMenuItems: function () {
		var self = this;
		var issue = this.props.data;
		var issueAssignee = issue.fields.assignee || {};
		var users = UserStore.getAll();
		var keys = Object.keys(users);
		var elements = [];

		keys.forEach(function (key, index) {
			var assignee = users[key];

			if (issueAssignee.key !== key) {
				var options = {
					assignee: assignee,
					issue: issue,
				}

				var menuItem = <MenuItem
								key={index}
								value={assignee.key}
								primaryText={assignee.displayName}
								onClick={self.personAddOnClick.bind(self, options)}
							/>

				elements.push(menuItem);
			}
		});

		return elements;
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
						{this.personAddMenuItems()}
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
