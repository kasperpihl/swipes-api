var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var SearchStore = Reflux.createStore({
	listenables: [Actions],
	searchValue: null,
	init: function () {
		this.manualLoadData();
		this.bouncedExtSearch = _.debounce(this.externalSearch, 500);
	},
	externalSearch: function (value, callback) {
		swipes._client.callSwipesApi("search", {query: value}, function (res, error) {
			if (callback) {
				callback(res, error);
			}
		});
	},
	defaults: {
		cache: {},
		results: []
	},
	onSearch: function (value) {
		this.searchValue = value;
		var that = this;

		if (value.length === 0) {
			this.set("results", []);
			return;
		}
		console.log('cache', this.get('cache'));
		if(this.get("cache")[value]){
			this.set('results', this.get("cache")[value]);
			return;
		}

		this.bouncedExtSearch(value, function (res, error) {
			if (res.ok === true) {
				var results = res.results.filter(function (result) {
					if (result.results.length > 0) {
						return result;
					}
				})
				var updateObj = {};
				updateObj[value] = results;
				that.update("cache", updateObj);
				if(value === that.searchValue){
					that.set('results', results);
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
