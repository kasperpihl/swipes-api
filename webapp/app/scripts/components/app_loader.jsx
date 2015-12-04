var React = require('react');
var stateStore = require('../stores/StateStore');
var Reflux = require('reflux');

var AppLoader = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange:function(states){
		var appForThisLoader = states["app_" + this.props.data.screen];
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	getInitialState:function(){
		return {app: false};
	},
	render: function() {
		if(!this.state.app)
			return ( <div>No app found</div> );
		return (
			<iframe src={this.props.data.app_src} className="app-frame-class" frameBorder="0"/>
		);
	}
});

module.exports = AppLoader;
