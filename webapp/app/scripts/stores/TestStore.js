var Reflux = require('reflux');
// The very purpose of this store, is to use for tests of new stuff etc. Put stuff in here, but remove it to a real store before production.
var testActions = require('../actions/TestActions');
var TestStore = Reflux.createStore({
	listenables: [testActions]

});

module.exports = TestStore;