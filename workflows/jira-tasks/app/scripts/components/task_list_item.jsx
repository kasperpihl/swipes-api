/*
	This is the card in the list view / check taskitem.jsx for the edit mode
*/
var React = require('react');
var Reflux = require('reflux');
var TaskListItem = React.createClass({
	renderSummary: function(){
		return <div className="task-summary">{this.props.data.fields.summary}</div>
	},
	onClick: function(){
		if(typeof this.props.onClickHandler === 'function'){
			this.props.onClickHandler(this.props.data.id);
		}
	},
	render: function() {
		return (
			<div onClick={this.onClick} className="list-item-container">
				<div className="list-item">
					{this.renderSummary()}
				</div>
			</div>
		);
	}
});


module.exports = TaskListItem;