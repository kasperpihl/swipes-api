var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var SearchStore = Reflux.createStore({
	listenables: [Actions],
	searchValue: null,
	init: function () {
		this.manualLoadData();
		this.set('cache', {});
		this.bouncedExtSearch = _.debounce(this.externalSearch, 500);
	},
	externalSearch: function (value, callback) {
		swipes._client.callSwipesApi("search", {query: value}, function (res, error) {
			if (callback) {
				callback(res, error);
			}
		});
	},
	onResetCache: function(){
		this.set('cache', {});
		console.log('reset cache');
	},
	onSearch: function (value) {
		this.searchValue = value;
		var that = this;

		if (value.length === 0) {
			this.set("results", []);
			return;
		}
		var cache = this.get("cache")[value]
		if(cache && cache !== this.get('results')){
			this.set('results', cache);
			return;
		}

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
