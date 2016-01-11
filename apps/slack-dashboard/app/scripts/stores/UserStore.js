var Reflux = require('reflux');

var UserStore = Reflux.createStore({
	me: function(){
		return this.find({me: true});
	}
});

module.exports = UserStore;