var React = require('react');
var Router = require('react-router');
var CircularProgress = require('material-ui/lib/circular-progress');
var Navigation = Router.Navigation;
var Loading = React.createClass({
	mixins: [ Navigation ],
	render: function() {
		return (
			<div className="main-loader">
				<CircularProgress color="#999" size={2}/>
			</div>
		);
	}
});

module.exports = Loading;
