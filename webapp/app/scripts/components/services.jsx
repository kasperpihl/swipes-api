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
var SelectField = require('material-ui/lib/SelectField');
var MenuItem = require('material-ui/lib/menus/menu-item');

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

Services.SelectRow = React.createClass({
	getInitialState: function(){
		return {value: null};
	},
	clickedAuthorize: function(){
		if(typeof this.props.onConnectNew === 'function'){
			this.props.onConnectNew();
		}
		var serviceName = this.props.data.manifest_id;
		var url = swipes.service(serviceName).getAuthorizeURL();
		var {ipcRenderer} = nodeRequire('electron');

		ipcRenderer.send('oauth-init', {
			serviceName: serviceName,
			url: url
		});
	},
	handleChange: function(event, index, value){
		if(value === this.props.data.services.length){
			this.clickedAuthorize();
		}
		else{
			var selectedAccount = this.props.data.services[value];
			if(typeof this.props.onSelectedAccount === 'function'){
				this.props.onSelectedAccount(selectedAccount);
			}
		}
	},
	renderSelector: function(){
		if(!this.props.data.services || !this.props.data.services.length){
			return <div className="services-button" onClick={this.clickedAuthorize}>Connect</div>
		}
		var items = this.props.data.services.map(function(service, i){
			return <MenuItem value={i} key={i} primaryText={service.show_name}/>
		});
		items = items.concat(<MenuItem value={this.props.data.services.length} key={"-1"} primaryText="Add New Account"/>);

		return (
			<SelectField floatingLabelStyle={{color: '#666D82'}} floatingLabelText="Select Account..." value={this.state.value} onChange={this.handleChange}>
        		{items}
      		</SelectField>
      	);
	},
	render: function(){
		var text;
		var src;



		if (!this.props.data.services || !this.props.data.services.length) {
			text = 'Connect to ' + this.props.data.title;
			src = 'styles/img/swipes-workspace-illustrations-emptystate-connect.svg'
		} else {
			text = 'Pick a team'
			src = 'styles/img/swipes-workspace-illustrations-emptystate-pickteam.svg'
		}
		return(
			<div className="row connect in-card">
				<img src={src} />
				<h6>{text}</h6>
				<p>We never store any of your information</p>
				{this.renderSelector()}
			</div>
		);
	}
});

Services.ConnectRow = React.createClass({
	clickedAuthorize: function(){
		var serviceName = this.props.data.manifest_id;
		var url = swipes.service(serviceName).getAuthorizeURL();
		var {ipcRenderer} = nodeRequire('electron');

		ipcRenderer.send('oauth-init', {
			serviceName: serviceName,
			url: url
		});
	},
	render: function(){
		console.log(this.props.data);
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
		console.log(this.props.data);
		UserActions.serviceDisconnect(this.props.data.id);
	},
	renderName: function() {

	},
	render: function () {
		console.log(this.props.data);
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
