var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var appStore = require('../AppStore');
var userStore = require('../UserStore');
var channelStore = require('../ChannelStore');

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
	onResetCache: function(){
		this.set('state', 'local');
		this.set('cache', {}, {trigger: false});
	},
	defaults: {
		state: 'local'
	},
	onSearch: function (value) {

		var that = this;
		
		if(value === this.searchValue)
			return;
		this.searchValue = value;
		if (value.length === 0) {
			this.set('state', 'local', {trigger: false});
			this.set('results', []);
			return;
		}
		var localResults = [userStore.search(value), appStore.search(value), channelStore.search(value)];
		localResults = localResults.filter(function (locRes) {
			if (locRes.results.length > 0) {
				return locRes;
			}
		})
		this.set('state', 'local', {trigger: false});
		this.set('results', localResults);
		
	},
	onExternalSearch: function(value){
		this.searchValue = value;
		
		var cache = this.get('cache')[value]
		if(cache && cache !== this.get('results')){
			this.set('state', 'external', {trigger: false});
			this.set('results', cache);
			return;
		}
		this.set('state', 'searching', {trigger: false});
		this.set('results', []);

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
				if(value === that.searchValue){
					that.set('state', 'external', {trigger: false});
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
