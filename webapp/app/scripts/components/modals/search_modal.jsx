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
		this.didEnterText = false;
		this.currentIndex = 0;
		this.resultsByIndex = [];
		this.debouncedChangePreview = _.debounce(this.changePreview, 700);

	},
	clickedRow: function(row){
		this.selectRowWithIndex(row.props.data.index);
	},
	selectRowWithIndex: function(index){
		var row = this.resultsByIndex[index];
		if(!row)
			return;
		console.log("select row", index, row);
		if(row.appId == 'ACORE'){
			if(row.id == 'search-all'){
				SearchModalActions.externalSearch(this.searchValue);
			}
		}
		else{
			if(this.props.data && this.props.data.callback){
				this.props.data.callback(row.text + " ");
			}
		}
	},
	changePreview: function($resultElement){
		/*var appId = $resultElement.attr('data-appid') || null;
		var resultId = $resultElement.attr('data-id') || null;
		var resultScope = $resultElement.attr('data-scope') || null;
		StateActions.loadPreview(appId, resultScope, resultId);*/
	},
	changeToItemWithIndex: function(index){
		if(!this.resultsByIndex.length) {
			return;
		}

		// Jump to top or bottom on overflow
		if (index < 0) {
			index = this.resultsByIndex.length - 1;
		}
		if (index >= this.resultsByIndex.length) {
			index = 0;
		}
		this.currentIndex = index;


		StateActions.unloadPreview();

		$(this.refs["results-list"]).find('.active').removeClass('active');
		var $el = $(this.refs["results-list"]).find('[data-index=' + index + ']');

		$el.addClass('active');
		this.autoScrollToEl($el);
	},
	autoScrollToEl:function(el){
		var $listEl = $(this.refs["results-list"]);

		// iten coordinates, relative to current scroll position, so if above scroll this will be -Xpx etc
		var elUpperY = el.position().top; // The Y for the upper edge of the item row
		var elLowerY = el.position().top + el.outerHeight(); // The Y for the lower edge of the item row

		var scrollY = $listEl.scrollTop(); // The current scroll position, needed because the positions are relative
		var height = $listEl.innerHeight(); // height of the showing list view (not the content/scroll)
		var contentHeight = $listEl.prop('scrollHeight'); // The whole content height inside the scroll container

		var newScrollPos; // 
		var extraBuffer = 0; // How much of the next row to show on autoscroll
		var edgeSnap = 30; // How long from the top/bottom should scroll be to snap to either top/bottom (used to snap above the category header on the way up)

		// If element is above the shown content in the view, scroll up to fit
		if(elUpperY < 0){
			newScrollPos = scrollY + elUpperY - extraBuffer;
		}
		// If element is above the shown content in the view, scroll down to fit at the bottom 
		else if(elLowerY > height){
			newScrollPos = scrollY + elLowerY - height + extraBuffer;
		}


		// if a new scroll position has been set, scroll there
		if(typeof newScrollPos != 'undefined'){
			var maxScrollPos = contentHeight - height;
			// Avoid overscroll and snap at the top
			if(newScrollPos < 0 || newScrollPos < edgeSnap ){
				newScrollPos = 0;
			}
			
			// Avoid overscroll and snap at the bottom
			if(newScrollPos > maxScrollPos || (maxScrollPos-newScrollPos) < edgeSnap ){
				newScrollPos = maxScrollPos;
			}

			$listEl.scrollTop(newScrollPos);
		}

		// To get an understanding of these mechanics try log below and do a search for "kas" in all apps 
		//console.log("elY", elY, "scrollY", scrollY, "height", height, "contentHeight", contentHeight, "newScrollPos", newScrollPos);

	},
	onKeyUp: function (e) {
		if(this.state.state === 'searching'){
			e.preventDefault();
			return;
		}
		var value = $(this.refs.search).val();

		this.searchValue = value;
		if(value.length > 0)
			this.didEnterText = true;
		var BACKSPACE = 8, ESC = 27, ENTER = 13;
		if(e.keyCode === ENTER && !e.shiftKey){
			return this.selectRowWithIndex(this.currentIndex);
		}
		if((e.keyCode === BACKSPACE && !value.length && !this.didEnterText) || e.keyCode === ESC){
			if(this.props.data && this.props.data.callback){
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
	onKeyDown: function(e) {
		if(this.state.state === 'searching'){
			e.preventDefault();
			return;
		}

		var UP = 38, DOWN = 40, TAB = 9, ENTER = 13;
		if(e.keyCode === ENTER && e.shiftKey){
			return this.selectRowWithIndex(this.currentIndex);
		}
		else if (e.keyCode === UP || (e.keyCode === TAB && e.shiftKey)) {
			e.preventDefault();
			this.changeToItemWithIndex(this.currentIndex - 1);
		}
		else if (e.keyCode === DOWN || e.keyCode === TAB) {
			e.preventDefault();
			this.changeToItemWithIndex(this.currentIndex + 1);

		}
	},
	getInitialState: function(){
		return {};
	},
	componentDidUpdate:function(prevProps, prevState){
		/*
		Whenever an update was run
		If new results, set to 0, but if local results, jump to 1 (this is to skip the action to search deep)
		*/
		var newIndex = this.currentIndex;
		if(this.state.results != prevState.results)
			newIndex = 0;
		if(this.state.state == 'local')
			newIndex = 1;
		this.changeToItemWithIndex(newIndex);
		$(this.refs.search).focus();
	},
	onBlur:function(){
		$(this.refs.search).focus();
	},
	render: function () {
		this.resultsByIndex = [];
		var label = '';
		var searchResults = this.state.results || [];
		var self = this;
		var counter = 0;
		var categories = [];
		function addCategory(category){
			var dCounter = counter;
			counter += category.results.length;
			self.resultsByIndex = self.resultsByIndex.concat(category.results);

			categories.push(<ResultList key={category.appId} data={{startCounter: dCounter, searchValue:self.searchValue, category: category, onClickedRow: self.clickedRow }} />);
		}


		if(this.searchValue && this.searchValue.length > 0){
			if(this.state.state == 'local'){
				var category = {
					appId: 'APREACTIONS',
					results: [{
						appId: 'ACORE',
						id: 'search-all',
						disableHighlight: true,
						text: 'Search all apps for: ' + this.searchValue
					}]
				};
				addCategory(category);
			}

			if(this.state.state == 'searching'){
				label = <div>Searching...</div>;
			}
			else if(!searchResults.length){
				label = <div>No results found</div>;
			}

			_.each(searchResults, addCategory);
		}

		return (
			<div className="search-modal">
				<div className="search-input-wrapper">
					<input type="text" placeholder="Search" id="main-search" onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref="search" onKeyUp={this.onKeyUp} />
					<label htmlFor="main-search">
						<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
						</svg>
					</label>
				</div>

				<div className="search-results-wrapper" ref="results-wrapper" >
					<div id="results-list" className="results-list" ref="results-list">
						{categories}
						{label}
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

		var nameHtml = '';
		if(this.props.data.category.name)
			nameHtml = <div className="result-title">{this.props.data.category.name}</div>
		var list = this.props.data.category.results;
		var self = this;
		var counter = this.props.data.startCounter;

		var rows = list.map(function (row) {
			return <ResultList.Row key={row.id} data={{index: counter++, row:row, searchValue: self.props.data.searchValue, onClickedRow: self.props.data.onClickedRow }} />
		});

		return (
			<div className="result-wrapper">
				{nameHtml}
				<ul className="results-specific-list">
					{rows}
				</ul>
			</div>
		);
	}
});

// ResultList.SearchButton = React.createClass({
//
// })

ResultList.Row = React.createClass({
	onClick: function() {
		this.props.data.onClickedRow(this);
	},
	render: function () {
		var row = this.props.data.row;

		var icon = row.icon || "";
		var searchValue = this.props.data.searchValue || "";
		// If disableHighlight is enabled for row, then ignore searchstring to not highlight
		if(row.disableHighlight)
			searchValue = "";

		var index = this.props.data.index || 0;

		return (
			<li className="result" ref="result" onClick={this.onClick} data-index={index}>
				<div className="icon">
					<i className="material-icons">{icon}</i>
				</div>
				<Highlight search={searchValue}>{row.text}</Highlight>

        		{/*<i className="material-icons mention">launch</i>*/}
			</li>

		);
	}
});

SearchModal.actions = SearchModalActions;

module.exports = SearchModal;
