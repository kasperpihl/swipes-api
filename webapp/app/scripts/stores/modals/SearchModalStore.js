var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var SearchStore = Reflux.createStore({
	listenables: [Actions],
	prevValue: null,
	cachedResponses: {},
	init: function () {
		this.manualLoadData();
		this.bouncedExtSearch = _.debounce(this.externalSearch, 500);
	},
	resetCache: function () {
		this.cachedResponses = {};
	},
	externalSearch: function (value, callback) {
		swipes._client.callSwipesApi("search", {query: value}, function (res, error) {
			if (callback) {
				callback(res, error);
			}
		});
	},
	onSearch: function (value) {
		var that = this;

		if (value.length === 0 || value === that.prevValue) {
			return;
		}

		that.prevValue = value;

		var cache = that.cachedResponses[value];

		if (cache) {
			var now = parseInt(new Date().getTime() / 1000, 10);
			var cacheTs = parseInt(cache.ts, 10);

			if (now - cacheTs <= 60) {
				that.set('results', cache.results);

				return;
			}
		}

		this.bouncedExtSearch(value, function (res, error) {
			if (res.ok === true) {
				var results = res.results.filter(function (result) {
					if (result.results.length > 0) {
						return result;
					}
				})

				that.cachedResponses[value] = {
					ts: res.ts,
					results: results
				};

				that.set('results', results);
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
