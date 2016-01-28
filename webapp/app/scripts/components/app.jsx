var React = require('react');
var Reflux = require('reflux');
var Loading = require('./loading');
var stateStore = require('../stores/StateStore');
var Modal = require('./modal');
var Topbar = require('./topbar');

var App = React.createClass({
  mixins: [ Reflux.ListenerMixin ],
  onStateChange: function (states) {
		if (states.isStarted !== this.state.isStarted ) {
			this.setState({
				isStarted: states.isStarted
			});
		}
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
    	</div>);
  }
});

module.exports = App;
