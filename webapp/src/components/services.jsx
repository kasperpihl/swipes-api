var React = require('react');
var Reflux = require('reflux');
var Topbar = require('./topbar/Topbar');
var Router = require('react-router');
var ServiceStore = require('../stores/ServiceStore');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var ServiceActions = require('../actions/ServiceActions');
var Reflux = require('reflux');
// KRIS_TODO: Replace material here
var Card = require('material-ui/lib/card/card');
var SelectField = require('material-ui/lib/SelectField');
var MenuItem = require('material-ui/lib/menus/menu-item');

var Navigation = Router.Navigation;
var getAuthorizeURL = function(serviceName){
	return swipesApi.getAPIURL() + 'services.authorize?service=' + serviceName;
};
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
			if(!realService){
				return null;
			}
			realService.service_id = realService.id;
			realService.id = service.id;

			return <Services.ConnectedRow key={service.id} showName={service.show_name} data={realService} />;
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
	                <Card className="services-card">
										<div className="services-card-title">Connect new Services</div>
                    {this.renderServicesToConnect()}
	                </Card>

	                <Card className="services-card">
										<div className="services-card-title">Connected Services</div>
                    {this.renderConnectedServices()}
	                </Card>
	            </div>
	        </div>
        );
	}
});

Services.ConnectRow = React.createClass({
	clickedAuthorize: function(){
		var serviceName = this.props.data.manifest_id;
		var url = getAuthorizeURL(serviceName);
		var {ipcRenderer} = nodeRequire('electron');

		ipcRenderer.send('oauth-init', {
			serviceName: serviceName,
			url: url
		});
	},
	render: function(){
		return(
			<div className="row connect">
				<h6>{this.props.data.title}</h6>
				<div className="services-button" onClick={this.clickedAuthorize}>Connect</div>
			</div>
		);
	}
});

Services.ConnectedRow = React.createClass({
	clickedRemove: function () {
		UserActions.serviceDisconnect(this.props.data.id);
	},
	renderName: function() {

	},
	render: function () {
		var showName = "";
		if(this.props.showName){
			showName = this.props.showName;
		}
		return(
			<div className="row connected">
				<h6>{this.props.data.title} <p>{showName}</p></h6>
				<div className="services-button" onClick={this.clickedRemove}>Disconnect</div>
			</div>
		);
	}
});

module.exports = Services;
