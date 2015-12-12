var React = require('react');
var SearchModalActions = require('../../actions/modals/SearchModalActions');
var SearchModalStore = require('../../stores/modals/SearchModalStore');
var Results = React.createClass({
	render: function () {
		var realResponse = this.props.data.realResponse;
		var i = 0;
		var rows = realResponse.map(function (row) {
			if(i == 0)
				row.is_active = true;
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
		var self = this;
		var rows = list.map(function (row) {
			if(i == 0 && self.props.data.is_active)
				row.is_active = true;
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
	onClick: function() {
		var $result = $(this.refs.result);
		$('.result').removeClass('active');
		$result.addClass('active');
	},
	render: function () {
		var resultClass = "result ";
		if(this.props.data.is_active)
			resultClass += "active";
		return (
			<ul className="results-specific-list">
				<li className={resultClass} ref="result" onClick={this.onClick} >
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
	componentDidMount: function(){
		$(this.refs.search).focus();
		this.didBackspace = true;
	},
	didBackspace: true,
	onSearch: function (e) {
		var value = $(this.refs.search).val();
		if(e.keyCode === 13){
			if(this.props.data && this.props.data.callback){
				this.props.data.callback();
			}
		}
		else if((e.keyCode === 8 && !value.length) || e.keyCode === 27){
			if(e.keyCode === 8 && !this.didBackspace){
				this.didBackspace = true;
				return;
			}
			if(this.props.data && this.props.data.callback){
				this.props.data.callback($(this.refs.search).val());
			}
		}
		else{
			if (value.length > 0) {
				this.didBackspace = false;
				$('.search-results-wrapper').addClass('open');
			} else {
				$('.search-results-wrapper').removeClass('open');
			}


			SearchModalActions.search(value);
		}
	},
	onKeyDown: function(e) {
		var UP = 38;
		var DOWN = 40;

		var result = $('li.result');
		var resultLength = result.length;
		var current = result.filter('.active');
		var currentIndex = result.index(current);
		var nextResult = currentIndex + 1;
		var prevResult = currentIndex - 1;

		if (e.keyCode === DOWN) {
			e.preventDefault();
			if (!result.hasClass('active')) {
				result.first().addClass('active');
			} else {
				if (currentIndex < (resultLength - 1)) {
					$(result[currentIndex]).removeClass('active');
					$(result[nextResult]).addClass('active');
				}
			}
		} else if (e.keyCode === UP) {
			e.preventDefault();
			if (currentIndex >= 1) {
				$(result[currentIndex]).removeClass('active');
				$(result[prevResult]).addClass('active');
			}
		}
	},
	render: function () {

		var defVal = "";
		if(this.props.data.options && typeof this.props.data.options.prefix === 'string')
			defVal = this.props.data.options.prefix;
		return (
			<div className="search-modal" onKeyDown={this.onKeyDown}>
				<div className="search-input-wrapper">
					<input type="text" placeholder="Search" defaultValue={defVal} id="main-search" ref="search" onKeyUp={this.onSearch} />
					<label htmlFor="main-search">
						<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
						</svg>
					</label>
				</div>

				<div className="search-results-wrapper" ref="results-wrapper" >
					<Results data={this.state.realResponse} />

					<div className="result-preview"></div>
				</div>
			</div>
		);
	}
});

SearchModal.actions = SearchModalActions;

module.exports = SearchModal;
