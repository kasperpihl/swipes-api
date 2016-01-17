var Reflux = require('reflux');

var UserStore = Reflux.createStore({
	idAttribute: 'key',
	me: function(){
		return _.findWhere(this.getAll(), {me: true});
	},
	fetch: function(){
		var self = this;
		swipes.service('jira').request('user.searchAssignable', {
			project: 'SWIP' 
		}, function(res, err){
			console.log('jira1', res, err);
			if(res && res.ok){
				self.batchLoad(res.data, {flush:true});
			}
		});
	}
});

module.exports = UserStore;