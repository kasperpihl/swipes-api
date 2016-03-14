var React = require('react');
var CircularProgress = require('material-ui/lib/circular-progress');

var Loading = React.createClass({
	render: function() {
		return (
			<div className="main-loader">
				<CircularProgress size={2} style={{maxWidth: '50%'}}/>
			</div>
		);
	}
});

module.exports = Loading;
