var React = require('react');
var Reflux = require('reflux');
var SearchModalActions = require('../../actions/modals/SearchModalActions');
var SearchModalStore = require('../../stores/modals/SearchModalStore');
var StateActions = require('../../actions/StateActions');

var PreviewLoader = require('../preview_loader');
var Highlight = require('react-highlighter');

var SearchModal = React.createClass({
	mixins: [SearchModalStore.connect()],
	componentDidMount: function(){
		$(this.refs.search).focus();
		SearchModalActions.resetCache();
		this.didBackspace = true;
		this.debouncedChangePreview = _.debounce(this.changePreview, 700);

	},
	clickedRow: function(row){
		var result = $('li.result');
		var $row = $(row.refs.result);
		var currentIndex = result.index($row);

		this.changeToItemWithIndex(currentIndex);
	},
	changePreview: function($resultElement){
		var appId = $resultElement.attr('data-appid') || null;
		var resultId = $resultElement.attr('data-id') || null;
		var resultScope = $resultElement.attr('data-scope') || null;
		StateActions.loadPreview(appId, resultScope, resultId);
	},
	changeToItemWithIndex: function(index){
		var result = $('li.result');

		StateActions.unloadPreview();

		if(!result.length) {
			return;
		}

		result.filter('.active').removeClass('active');
		$(result[index]).addClass('active');

		this.debouncedChangePreview($(result[index]));
	},
	onSearch: function (e) {
		var value = $(this.refs.search).val();

		this.searchValue = value;

		if(e.keyCode === 13){
			if(this.props.data && this.props.data.callback){
				return this.props.data.callback();
			}
		}
		else if((e.keyCode === 8 && !value.length) || e.keyCode === 27){
			if(e.keyCode === 8 && !this.didBackspace){
				this.didBackspace = true;
			}
			else if(this.props.data && this.props.data.callback){
				return this.props.data.callback($(this.refs.search).val());
			}
		}
		SearchModalActions.search(value);

		if (value.length > 0) {
			this.didBackspace = false;
			$('.search-results-wrapper').addClass('open');
		} else {
			$('.search-results-wrapper').removeClass('open');
		}
	},
	prevItem: function() {
		var result = $('li.result');
		var current = result.filter('.active');
		var currentIndex = result.index(current);
		var prevResult = currentIndex - 1;

		if (prevResult < 0) {
			prevResult = result.length - 1;
		}

		this.changeToItemWithIndex(prevResult);
	},
	nextItem: function(){
		var result = $('li.result');
		var currentIndex = result.index(result.filter('.active'));
		var nextResult = currentIndex + 1;

		if (nextResult >= result.length || nextResult < 0) {
			nextResult = 0;
		}

		this.changeToItemWithIndex(nextResult);
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
	getInitialState: function(){
		return {};
	},
	componentDidUpdate: function () {
		this.changeToItemWithIndex(0);
	},
	render: function () {
		var defVal = "";

		if(this.props.data.options && typeof this.props.data.options.prefix === 'string') {
			defVal = this.props.data.options.prefix;
		}

		var searchResults = this.state.results || [];
		console.log(this.state.results);
		var self = this;
		var categories = searchResults.map(function (category) {
			return <ResultList key={category.appId} data={{searchValue:self.searchValue, category: category, onClickedRow: self.clickedRow }} />
		});

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
					<div id="results-list" className="results-list">
						{categories}
					</div>
					<div className="result-preview">
						<PreviewLoader data={{preview:1}}/>
					</div>
				</div>
			</div>
		);
	}
});

var ResultList = React.createClass({
	render: function () {

		var name = this.props.data.category.name || 'Unknown';
		var list = this.props.data.category.results;
		var self = this;

		var rows = list.map(function (row) {
			row.appId = self.props.data.category.appId;

			return <ResultList.Row key={row.id} data={{row:row, searchValue: self.props.data.searchValue, onClickedRow: self.props.data.onClickedRow }} />
		});

		return (
			<div className="result-wrapper">
				<div className="result-title">{name}</div>
				<ul className="results-specific-list">
					{rows}
				</ul>
			</div>
		);
	}
});

ResultList.Row = React.createClass({
	onClick: function() {
		this.props.data.onClickedRow(this);
	},
	render: function () {
		var resultClass = "result ";
		var row = this.props.data.row;
		if(row.is_active) {
			resultClass += "active";
		}

		var appId = row.appId || "";
		var id = row.id || "";
		var scope = row.scope || "";
		var icon = row.icon || "";

		return (
			<li className={resultClass} ref="result" onClick={this.onClick} data-appid={appId} data-id={id} data-scope={scope}>
				<div className="icon">
					<i className="material-icons">{icon}</i>
				</div>
				<Highlight search={this.props.data.searchValue || ""}>{row.text}</Highlight>

        		<i className="material-icons mention">launch</i>
			</li>
			
		);
	}
});

SearchModal.actions = SearchModalActions;

module.exports = SearchModal;
