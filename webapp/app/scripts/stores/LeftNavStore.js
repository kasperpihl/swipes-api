var Reflux = require('reflux');
// The very purpose of this store, is to use for tests of new stuff etc. Put stuff in here, but remove it to a real store before production.
var leftNavActions = require('../actions/LeftNavActions');
var LeftNavStore = Reflux.createStore({
	listenables: [leftNavActions],
	onLoad: function(options, callback){
		console.log('opening', options);
		if(typeof callback === 'function'){
			this.set('callback', callback, {trigger:false});
		}
		this.set('items', options.items, {trigger: false});
		this.set('open', true);
	},
	onHide: function(res){
		if(this.get('callback')){
			this.get('callback')(res);
		}
		this.set('items', null, {trigger: false});
		this.set('callback', null, {trigger:false});

		this.set('open', false);
	},

});

module.exports = LeftNavStore;