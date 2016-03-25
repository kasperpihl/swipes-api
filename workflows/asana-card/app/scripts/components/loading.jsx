var React = require('react');
var CircularProgress = require('material-ui/lib/circular-progress');

var Loading = React.createClass({
	render: function() {
		return (
			<div className="main-loader">
				<CircularProgress className="testing-this-two" color="#777" size={1}/>
			</div>
		);
	}
});

module.exports = Loading;
