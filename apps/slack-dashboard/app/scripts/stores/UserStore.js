var Reflux = require('reflux');

var UserStore = Reflux.createStore({
	me: function(){
		return _.findWhere(this.getAll(), {me: true});
	}
});

module.exports = UserStore;