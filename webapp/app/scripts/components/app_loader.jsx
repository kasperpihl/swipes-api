var React = require('react');
var stateStore = require('../stores/StateStore');
var Reflux = require('reflux');

var AppLoader = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	onStateChange:function(states){
		var appForThisLoader = states["screen" + this.props.data.screen];
		if(appForThisLoader && appForThisLoader !== this.state){
			this.setState(appForThisLoader);
		}
	},
	componentWillMount: function(){
		this.listenTo(stateStore, this.onStateChange, this.onStateChange);
	},
	getInitialState:function(){
		return {app: false};
	},
	onLoad:function(){

	},
	render: function() {
		if(!this.state.app)
			return ( <div>No app found</div> );
		return (
			<iframe onLoad={this.onLoad} src={this.state.url} className="app-frame-class" frameBorder="0"/>
		);
	}
});

module.exports = AppLoader;
