var Reflux = require('reflux');

var UserStore = Reflux.createStore({
	idAttribute: 'key'
	// me: function() {
	// 	return _.findWhere(this.getAll(), {me: true});
	// }
	// fetch: function(){
	// 	var self = this;
	// 	swipes.service('jira').request('user.searchAssignable', {
	// 		project: 'SWIP'
	// 	}).then(function(res){
	// 		self.batchLoad(res.data, {flush:true});
	// 	}).catch(function(err){
	// 		console.log('err userstor', err);
	// 	});
	// }
});

module.exports = UserStore;
