var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var WorkflowStore = require('../WorkflowStore');
var userStore = require('../UserStore');

var SearchStore = Reflux.createStore({
	listenables: [Actions],
	searchValue: null,
	init: function () {
		this.manualLoadData();
		this.set('cache', {});
		this.bouncedExtSearch = _.debounce(this.doExternalSearch, 500);
	},
	doExternalSearch: function (value, callback) {
		swipes._client.callSwipesApi("search", {query: value}, function (res, error) {
			if (callback) {
				callback(res, error);
			}
		});
	},
	onResetCache: function() {
		this.set('state', 'local');
		this.set('cache', {}, {trigger: false});
	},
	defaults: {
		state: 'local'
	},
	setResults: function(results, state) {
		this.set('state', state, {trigger: false});
		this.set('results', results);
	},
	onSearch: function (value) {
		var that = this;

		if(value === this.searchValue) {
			return;
		}

		this.searchValue = value;

		if (value.length === 0) {
			this.setResults([], 'local');
			return;
		}

		var localResults = [userStore.search(value), WorkflowStore.search(value)];

		localResults = localResults.filter(function (locRes) {
			if (locRes.results.length > 0) {
				return locRes;
			}
		})

		this.setResults(localResults, 'local');
	},
	onExternalSearch: function(value){
		this.searchValue = value;

		var cache = this.get('cache')[value];

		if (cache && cache !== this.get('results')) {
			this.setResults(cache, 'external');
			return;
		}

		this.setResults([], 'searching');

		var that = this;

		this.bouncedExtSearch(value, function (res, error) {
			if (res.ok === true) {
				var results = res.results.filter(function (result) {
					if (result.results.length > 0) {
						return result;
					}
				})
				console.log(results);
				var updateObj = {};
				updateObj[value] = results;
				that.update("cache", updateObj, {trigger: false});
				if (value === that.searchValue) {
					that.setResults(results, 'external');
				}
			} else {
				console.log('Search error ' + res.err);
			}
			if (error) {
				console.log(error);
			}
		})
	}
});

module.exports = SearchStore;
