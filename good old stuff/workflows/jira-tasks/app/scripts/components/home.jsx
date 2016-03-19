var React = require('react');
var Reflux = require('reflux');
var TaskList = require('./task_list');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var Setup = require('./setup');

var Home = React.createClass({
	mixins: [MainStore.connect()],
	renderProjectPicker: function(){
	},
	render: function() {
		var settings = this.state.settings;
		if(!settings){
			return <div>Loading</div>;
		}
		else if(!settings.isReady){
			return <Setup data={this.state.settings} />
		}
		else{
			return <TaskList />;
		}
	}
});


module.exports = Home;