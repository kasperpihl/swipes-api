var React = require('react');
var Router = require('react-router');
var CircularProgress = require('material-ui/lib/circular-progress');
var Navigation = Router.Navigation;
var Loading = React.createClass({
	mixins: [ Navigation ],
	render: function() {
		return (
			<CircularProgress size={2} className="main-loader"/>
		);
	}
});

module.exports = Loading;
