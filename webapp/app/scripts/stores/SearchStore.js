var Reflux = require('reflux');
var searchActions = require('../actions/SearchActions');

var SearchStore = Reflux.createStore({
	listenables: [ searchActions ],
	defaults: {
		searching: false
	},
	onOpenSearch:function(open){
		this.set('searching', (open));
	},
	onSearch: function(string, options){
		
	}
});

module.exports = SearchStore;
