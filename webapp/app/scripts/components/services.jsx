var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var Router = require('react-router');
var ServiceStore = require('../stores/ServiceStore');
var UserStore = require('../stores/UserStore');
var ServiceActions = require('../actions/ServiceActions');
var Reflux = require('reflux');

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
      <div className="main">
      <Sidebar />
        <div className="right-side-container">
          <div className="content-container" idName="main">
            <div className="app-view-controller">
              <Topbar data={{screen: 1}}/>
              {this.renderServicesToConnect()}
      				{this.renderConnectedServices()}
      				{this.renderAddServiceButton()}
            </div>
          </div>
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
				<h3>{this.props.data.title}</h3>
				<button onClick={this.clickedAuthorize}>Connect</button>
			</div>
		);
	}
});

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
});

module.exports = Services;
