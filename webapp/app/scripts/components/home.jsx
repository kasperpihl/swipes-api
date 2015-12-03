var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var AppLoader = require('./app_loader');
var Router = require('react-router');
var homeStore = require('../stores/HomeStore');
var socketHandler = require('../handlers/SocketHandler');

var Navigation = Router.Navigation;
var Home = React.createClass({
	mixins: [ Navigation, Reflux.connect(homeStore) ],
	componentDidMount: function(){
		if(!this.state.swipesToken){
			return this.transitionTo("/login");
		}
		else{
			socketHandler.start();
		}
		
	},
	render: function() {
		var toggle = this.state["sidebar-closed"] ? true : false;
		$("body").toggleClass("sidebar-closed", toggle);
		return (
			<div className="main">
				<Sidebar />
				<div className="right-side-container">
					<div className="content-container" idName="main">
						<div className="app-view-controller">
							<Topbar data={{screen:1}}/>
							<AppLoader data={{app_src:"test"}}/>
						</div> 
						<div className="app-view-controller">
							<Topbar data={{screen:2}}/>
							<AppLoader data={{app_src:"test"}} />
						</div>
						<div className="app-view-controller">
							<Topbar data={{screen:3}}/>
							<AppLoader data={{}} />
						</div> 
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Home;
