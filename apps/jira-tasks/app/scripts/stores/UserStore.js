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
		}, function(err, res){
			console.log('jira1', res, err);
			if(res){
				self.batchLoad(res, {flush:true});
			}
		});
	}
});

module.exports = UserStore;