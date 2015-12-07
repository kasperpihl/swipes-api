var React = require('react');
var SearchModalActions = require('../../actions/modals/SearchModalActions');
var SearchModalStore = require('../../stores/modals/SearchModalStore');

var Results = React.createClass({
	render: function () {
		var realResponse = this.props.data.realResponse;
		var i = 0;
		var rows = realResponse.map(function (row) {
			return <Results.Wrapper key={++i} data={row} />
		});

		return (
			<div className="results-list">
				{rows}
			</div>
		);
	}
});

Results.Wrapper = React.createClass({
	render: function () {
		var name = this.props.data.name;
		var icon = this.props.data.icon;
		var list = this.props.data.list;
		var i = 0;
		var rows = list.map(function (row) {
			return <Results.Row key={++i} icon={icon} data={row} />
		});


		return (
			<div className="result-wrapper">
				<div className="result-title">{name}</div>
				{rows}
			</div>
		);
	}
});

Results.Row = React.createClass({
	render: function () {
		return (
			<ul className="results-specific-list">
				<li className="result">
				<div className="icon">
					<i className="material-icons">{this.props.icon}</i>
				</div>
				{this.props.data.text}
				</li>
			</ul>
		);
	}
});

var SearchModal = React.createClass({
	mixins: [SearchModalStore.connect("realResponse")],
	onSearch: function () {
		var value = $(this.refs.search).val();

		SearchModalActions.search(value);
	},
	render: function () {
		return (
			<div className="search-modal">
				<div className="search-input-wrapper">
					<input type="text" placeholder="Search" id="main-search" ref="search" onKeyUp={this.onSearch} />
					<label for="main-search">
						<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
						</svg>
					</label>
				</div>

				<div className="search-results-wrapper">
					<Results data={this.state.realResponse} />

					<div className="result-preview"></div>
				</div>
			</div>
		);
	}
});

module.exports = SearchModal;
