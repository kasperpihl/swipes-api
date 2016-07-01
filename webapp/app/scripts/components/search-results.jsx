var React = require('react');
var searchStore = require('../stores/SearchStore');
var searchActions = require('../actions/SearchActions');
var topbarActions = require('../actions/TopbarActions');

var SearchResults = React.createClass({
	mixins: [searchStore.connect('search')],
	onClick:function(e){
		if(e.target.classList.contains("search-view-overlay")){
			topbarActions.changeSearch(false);
		}
	},
	renderEmptyScreen(){
		return "Type Enter to search";
	},
	render: function() {
		console.log('searching!', this.state);
		var className = "search-view-overlay";
		if(this.state.search.searching){
			className += ' open';
		}
		return (
			<div className={className} onClick={this.onClick}>
				<div className="search-results">
					{this.renderEmptyScreen()}
				</div>
			</div>
		);
	}
});

module.exports = SearchResults;