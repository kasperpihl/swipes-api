var React = require('react');
var Reflux = require('reflux');
var Loading = require('./loading');

var ExpandedTask = React.createClass({
  getInitialState: function () {
		return {
			task: null
		}
	},
  componentWillMount: function () {
    var taskId = this.props.taskId;

    console.log(taskId);
  },
  render: function () {
    var task = this.state.task;

    return (
      <div>
        {task ? (
          <div>dada</div>
        ) : (
          <Loading />
        )}
      </div>
    )
  }
});

module.exports = ExpandedTask;
