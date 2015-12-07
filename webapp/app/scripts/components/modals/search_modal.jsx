var React = require('react');
var SearchModal = React.createClass({
	render: function(){
		return (
			<div className="search-modal">
				<input type="text" placeholder="Search"/>
				<label for=""></label>
			</div>
		);
	}
});

module.exports = SearchModal;