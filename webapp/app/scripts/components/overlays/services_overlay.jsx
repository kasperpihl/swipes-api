var React = require('react');
var ServiceStore = require('../../stores/ServiceStore');
var UserStore = require('../../stores/UserStore');
var ServiceActions = require('../../actions/ServiceActions');
var Reflux = require('reflux');
var Services = React.createClass({
	mixins: [ServiceStore.connect("services"), Reflux.connectFilter(UserStore, "user", function(users) {
		return users.filter(function(user) {
			return user.me;
		}.bind(this))[0];
	})],
	clickedAddService: function(){
		this.setState({addService: true});
	},
	renderConnectedServices: function(){
		if(this.state.addService){
			return "";
		}
		var sortedServices = _.sortBy(this.state.user.services, 'service_name');
		if(!sortedServices.length){
			return "No services connected";
		}
		var self = this;
		return sortedServices.map(function(service){
			var realService = self.state.services[service.service_id];
			return <Services.ConnectedRow key={service.id} data={realService} />;
		})
	},
	renderServicesToConnect: function(){
		if(!this.state.addService){
			return "";
		}

		var sortedServices = _.sortBy(this.state.services, 'title');

		return sortedServices.map(function (service) {
			return <Services.ConnectRow key={service.id} data={service} />;
		})
	},

	renderAddServiceButton:function(){
		if(this.state.addService){
			return "";
		}
		return <button onClick={this.clickedAddService}>Connect new service</button>;
	},
	render: function() {
		console.log(this.state);

		return (
			<div className="service-overlay-container">
				{this.renderServicesToConnect()}
				{this.renderConnectedServices()}
				{this.renderAddServiceButton()}
			</div>
		);
	}
});
Services.ConnectRow = React.createClass({
	clickedAuthorize: function(){
		ServiceActions.authorize(this.props.data.manifest_id);
	},
	render: function(){
		console.log(this.props.data);
		return(
			<div className="row connect">
				<h3>{this.props.data.title}</h3>
				<button onClick={this.clickedAuthorize}>Connect</button>
			</div>
		);
	}
})
Services.ConnectedRow = React.createClass({
	clickedRemove: function(){
		//ServiceActions.remove()
	},
	render: function(){
		console.log(this.props.data);
		return(
			<div className="row connected">
				<h3>Connected: {this.props.data.title}</h3>
				{/*<button onClick={this.clickedRemove}>Remove</button>*/}
			</div>
		);
	}
})

module.exports = Services;