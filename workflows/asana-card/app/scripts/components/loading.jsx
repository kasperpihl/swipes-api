var React = require('react');
var CircularProgress = require('material-ui/lib/circular-progress');

var Loading = React.createClass({
	render: function() {
		var style = this.props.style;

		return (
			<div className="main-loader">
				<CircularProgress style={style} className="testing-this-two" color="#777" size={1}/>
			</div>
		);
	}
});

module.exports = Loading;
