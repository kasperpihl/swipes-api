var React = require('react');
var ServiceStore = require('../../stores/ServiceStore');
var ServiceActions = require('../../actions/ServiceActions');
var Reflux = require('reflux');
var Services = React.createClass({
	clickedAuthorize: function(){
		ServiceActions.authorize("slack");
	},
	render: function() {
		return (
			<div onClick={this.clickedAuthorize} className="service-container">
				Click to start auth (In progress/not working)
			</div>
		);
	}
});
Services.Row = React.createClass({
	render: function(){
		return(
			<div/>
		);
	}
})

module.exports = Services;