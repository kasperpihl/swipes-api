var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var ProjectPicker = require('./project_picker');

var Setup = React.createClass({
	mixins: [MainStore.connect()],
	render: function () {
		return (
			<div className="setup">
				<ProjectPicker />
			</div>
		);
	}
});

module.exports = Setup;
