var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var SearchStore = Reflux.createStore({
	listenables: [Actions],
	cachedResponses: {},
	init: function(){
		this.manualLoadData();
		this.bouncedExtSearch = _.debounce(this.externalSearch, 500);
	},
	resetCache: function(){
		this.cachedResponses = {};
	},
	defaults: {
		realResponse: []
	},
	prevValue: null,
	timer: null,
	externalSearch: function(value, callback){
		swipes._client.callSwipesApi("search", {query: value}, function (res, error) {
			if(callback){
				callback(res, error);
			}
		});
	},
	onSearch: function (value) {
		var that = this;

		if (value.length === 0 || value === that.prevValue) {
			return;
		} 

		that.set("realResponse", []);
		that.prevValue = value;
		this.bouncedExtSearch(value, function(res, error){
			if (res.ok === true) {
				var results = res.results.filter(function (result) {
					if (result.results.length > 0) {
						return result;
					}
				})

				if (results.length > 0) {
					that.set("realResponse", results);
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
