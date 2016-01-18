/*
	This is the edit view for an issue / check tasklistitem.jsx for the list item view
 */
var React = require('react');
var Reflux = require('reflux');
var IssueStore = require('../stores/IssueStore');
var TaskItem = React.createClass({
	mixins: [IssueStore.connectFilter('issue', function(issues){
		return issues.filter(function(issue) {
           return issue.id === this.props.id;
        }.bind(this))[0];
	})],
	onClick: function(){
		if(typeof this.props.onClickHandler === 'function'){
			this.props.onClickHandler();
		}
	},
	renderSummary: function(){
		return <div className="task-summary">{this.state.issue.fields.summary}</div>
	},
	render: function() {
		return (
			<div onClick={this.onClick} className="item-container">
				<div className="task-item">
					Item: {this.renderSummary()}
				</div>
			</div>
		);
	}
});


module.exports = TaskItem;