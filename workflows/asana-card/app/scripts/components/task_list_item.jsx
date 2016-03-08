var React = require('react');
var Reflux = require('reflux');
var Paper = require('material-ui/lib').Paper;
var Avatar = require('material-ui/lib').Avatar;
var IconMenu = require('material-ui/lib').IconMenu;
var IconButton = require('material-ui/lib').IconButton;
var MenuItem = require('material-ui/lib').MenuItem;
var Colors = require('material-ui/lib/styles/colors');
var UserStore = require('../stores/UserStore');
var MainActions = require('../actions/MainActions');
var ProjectActions = require('../actions/ProjectActions');

var TaksItem = React.createClass({
  getInitialState: function(){
	    return {
        actionBar: 'inactive'
	    };
	},
  activate: function() {
    if (this.state.actionBar == 'inactive') {
        this.setState({actionBar: 'active'});
    } else {
        this.setState({actionBar: 'inactive'});
    }
  },
	render: function() {
		var task = this.props.data;
		var taskState = task.completed ? 'done' : 'todo';
		var dotColor = "dot " + taskState;

		return (
			<div className="task-wrapper">
        <div className="task" onClick={this.activate}>
          <div className="task-list-element">
  					<div className={dotColor}></div>
  				</div>
  				<div className="task-details-wrap">
  					<div className="task-title">{task.name}</div>
  				</div>
        </div>
			</div>
		)
	}
})


module.exports = TaksItem;
