/*
	This is the card in the list view / check taskitem.jsx for the edit mode
*/
var React = require('react');
var Reflux = require('reflux');
var Card = require('material-ui/lib').Card;
var CardHeader = require('material-ui/lib').CardHeader;
var TaskListItem = React.createClass({
	renderSummary: function(){
		return <div className="task-summary"></div>
	},
	onClick: function(){
		if(typeof this.props.onClickHandler === 'function'){
			this.props.onClickHandler(this.props.data);
		}
	},
	renderSubtitle: function(){
		return this.props.data.fields.status.name;
	},
	render: function() {
		return (
			<Card onClick={this.onClick} className="card-container">
				<CardHeader title={this.props.data.fields.summary}
						subtitle={this.renderSubtitle()} />
			</Card>
		);
	}
});


module.exports = TaskListItem;