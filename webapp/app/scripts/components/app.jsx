var React = require('react');
var Reflux = require('reflux');
var Loading = require('./loading');
var stateStore = require('../stores/StateStore');
var Modal = require('./modal');
var Topbar = require('./topbar/topbar');
var LeftNav = require('./left_nav');

// Requiring the stores
var eventStore = require('../stores/EventStore');
//var notificationStore = require('../stores/NotificationStore');

var App = React.createClass({
  mixins: [ Reflux.ListenerMixin ],
  onStateChange: function (states) {
		if (states.isStarted !== this.state.isStarted ) {
			this.setState({
				isStarted: states.isStarted
			});
		}
	},
  componentDidMount:function() {
    amplitude.logEvent('Session - Opened App');
    mixpanel.track('Opened App');
  },
  componentWillMount: function () {
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
  getInitialState: function () {
		return {};
	},
  render: function () {
    if (!this.state.isStarted) {
			return ( <Loading /> );
		}

    return (
    	<div className="main">
    		<Topbar />
    		<div className="active-app">
    			{this.props.children}
    		</div>
    		<Modal />
        <LeftNav />
    	</div>);
  }
});

module.exports = App;
