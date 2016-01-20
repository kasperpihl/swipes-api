/*
	This is the card in the list view / check taskitem.jsx for the edit mode
*/
var React = require('react');
var Reflux = require('reflux');
var Card = require('material-ui/lib').Card;
var CardText = require('material-ui/lib').CardText;
var TaskListItem = React.createClass({
	renderSummary: function(){
		return <div className="task-summary"></div>
	},
	onClick: function(){
		if(typeof this.props.onClickHandler === 'function'){
			this.props.onClickHandler(this.props.data.id);
		}
	},
	render: function() {
		return (
			<Card onClick={this.onClick} className="card-container">
				<CardText>
					{this.props.data.fields.summary}
				</CardText>
			</Card>
		);
	}
});


module.exports = TaskListItem;