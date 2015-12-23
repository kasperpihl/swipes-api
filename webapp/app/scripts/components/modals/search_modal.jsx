var React = require('react');
var SearchModalActions = require('../../actions/modals/SearchModalActions');
var SearchModalStore = require('../../stores/modals/SearchModalStore');
var StateActions = require('../../actions/StateActions');
var AppStore = require('../../stores/AppStore');
require('../../third-party/highlight-plugin');
var PreviewLoader = require('../preview_loader');
var searchValue = '';

var changePreview = function ($resultElement) {
	console.log("change preview", $resultElement);
	var appId = $resultElement.attr('data-appid') || null;
	var resultId = $resultElement.attr('data-id') || null;
	var resultScope = $resultElement.attr('data-scope') || null;
	StateActions.loadPreview(appId, resultScope, resultId);
}

var debouncedChangePreview = _.debounce(changePreview, 300);



var SearchModal = React.createClass({
	mixins: [SearchModalStore.connect("realResponse")],
	componentDidMount: function(){
		$(this.refs.search).focus();
		this.didBackspace = true;
	},
	didBackspace: true,
	onSearch: function (e) {
		var value = $(this.refs.search).val();

		searchValue = value;

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
		else {
			SearchModalActions.search(value);

			if (value.length > 0) {
				this.didBackspace = false;
				$('.search-results-wrapper').addClass('open');
			} else {
				$('.search-results-wrapper').removeClass('open');
			}
		}
	},
	prevItem: function(){
		var result = $('li.result');

		var current = result.filter('.active');
		var currentIndex = result.index(current);
		var prevResult = currentIndex - 1;
		if(prevResult < 0)
			prevResult = result.length - 1;
	
		this.changeToItem(prevResult);
	},
	changeToItem: function(index){
		var result = $('li.result');
		if(!result.length)
			return;
		result.filter('.active').removeClass('active');
		console.log("change to item", index);
		$(result[index]).addClass('active');
		StateActions.unloadPreview();
		debouncedChangePreview($(result[index]));
	},
	nextItem: function(){
		var result = $('li.result');
		var currentIndex = result.index(result.filter('.active'));
		var nextResult = currentIndex + 1;
		if(nextResult >= result.length || nextResult < 0){
			nextResult = 0;
		}
		this.changeToItem(nextResult);

	},
	onKeyDown: function(e) {
		var UP = 38;
		var DOWN = 40;
	
		if (e.keyCode === DOWN) {
			e.preventDefault();
			this.nextItem();
			
		} else if (e.keyCode === UP) {
			e.preventDefault();
			this.prevItem();
		}
	},
	onLoadPreview: function () {
		console.log('preview loaded!');
	},
	componentDidUpdate: function () {
		this.changeToItem(0);
	},
	render: function () {
		var defVal = "";

		if(this.props.data.options && typeof this.props.data.options.prefix === 'string') {
			defVal = this.props.data.options.prefix;
		}

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
					<ResultList data={this.state.realResponse} />

					<div className="result-preview">
						<PreviewLoader data={{preview:1}}/>
					</div>
				</div>
			</div>
		);
	}
});

var ResultList = React.createClass({
	componentDidUpdate: function () {
		$("#results-list .result span").highlight(searchValue);
	},
	render: function () {
		var realResponse = this.props.data.realResponse;
		var i = 0;

		var rows = realResponse.map(function (row) {
			if(i == 0) {
				row.is_active = true;
			}

			return <ResultList.Category key={++i} data={row} />
		});

		return (
			<div id="results-list" className="results-list">
				{rows}
			</div>
		);
	}
});

ResultList.Category = React.createClass({
	render: function () {
		var app = AppStore.get(this.props.data.appId);
		var name = app.name || 'Unknown';
		var list = this.props.data.results;
		var i = 0;
		var self = this;

		var rows = list.map(function (row) {
			if(i == 0 && self.props.data.is_active) {
				row.is_active = true;
			}

			row.appId = app.id;

			return <ResultList.Row key={++i} data={row} />
		});

		return (
			<div className="result-wrapper">
				<div className="result-title">{name}</div>
				{rows}
			</div>
		);
	}
});

ResultList.Row = React.createClass({
	onClick: function() {
		var $result = $(this.refs.result);

		$('.result').removeClass('active');
		$result.addClass('active');
		debouncedChangePreview($result);
	},
	render: function () {
		var resultClass = "result ";

		if(this.props.data.is_active) {
			resultClass += "active";
		}

		return (
			<ul className="results-specific-list">
				<li
					className={resultClass}
					ref="result"
					onClick={this.onClick}
					data-appid={this.props.data.appId}
					data-id={this.props.data.id}
					data-scope={this.props.data.scope} >
				<div className="icon">
					<i className="material-icons">{this.props.data.icon}</i>
				</div>
				{this.props.data.text}
                
                <i className="material-icons mention">launch</i>
				</li>
			</ul>
		);
	}
});


SearchModal.actions = SearchModalActions;

module.exports = SearchModal;
