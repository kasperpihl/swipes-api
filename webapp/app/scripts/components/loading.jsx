var React = require('react');
var socketHandler = require('../handlers/SocketHandler');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Loading = React.createClass({
	mixins: [ Navigation ],
	render: function() {
		return (
			<div>
				<p>Loading</p>
			</div>
		);
	}
});

module.exports = Loading;
