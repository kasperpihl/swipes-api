var React = require('react');
var Reflux = require('reflux');
var Topbar = require('./topbar');
var Router = require('react-router');
var ServiceStore = require('../stores/ServiceStore');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var ServiceActions = require('../actions/ServiceActions');
var Reflux = require('reflux');
var Card = require('material-ui/lib/card/card');
var FlatButton = require('material-ui/lib/flat-button');

var Navigation = Router.Navigation;

var Services = React.createClass({
	mixins: [ServiceStore.connect("services"), Reflux.connectFilter(UserStore, "user", function(users) {
		return users.filter(function(user) {
			return user.me;
		}.bind(this))[0];
	})],
	renderConnectedServices: function(){
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
		var sortedServices = _.sortBy(this.state.services, 'title');

		return sortedServices.map(function (service) {
			return <Services.ConnectRow key={service.id} data={service} />;
		})
	},

	renderAddServiceButton:function(){
		return <button onClick={this.clickedAddService}>Connect new service</button>;
	},
	render: function() {
        return (
        	<div className="scroll-container">
	            <div className="services-wrapper">
	                <h6>Available Flows</h6>
	                <Card className="services-card">
	                    {this.renderServicesToConnect()}
	                </Card>
	                <h6>Connected Flows</h6>
	                <Card className="services-card">
	                    {this.renderConnectedServices()}
	                </Card>
	            </div>
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
				<h6>{this.props.data.title}</h6>
                <FlatButton onClick={this.clickedAuthorize} label="Connect" style={{color: '#4BAE4F'}}/>
			</div>
		);
	}
});

Services.ConnectedRow = React.createClass({
	clickedRemove: function () {
		console.log(this.props.data);
		UserActions.serviceDisconnect(this.props.data.id);
	},
	render: function () {
		console.log(this.props.data);
		return(
			<div className="row connected">
				<h6>{this.props.data.title}</h6>
				<FlatButton onClick={this.clickedRemove} label="Disconnect" />
			</div>
		);
	}
});

module.exports = Services;
