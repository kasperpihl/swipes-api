var React = require('react');
var Reflux = require('reflux');
var Sidebar = require('./sidebar');
var Topbar = require('./topbar');
var Router = require('react-router');

var Navigation = Router.Navigation;

var Services = React.createClass({
  getInitialState: function() {
		return {};
	},
  render: function () {
    return (
      <div className="main">
        <Sidebar />
        <div className="right-side-container">
					<div className="content-container" idName="main">
						<div className="app-view-controller">
							<Topbar data={}/>
              <div>Services goes here</div>
						</div>
					</div>
				</div>
      </div>
    );
  }
});

module.exports = Services;
