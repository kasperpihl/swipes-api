var Reflux = require('reflux');
var WorkspaceStore = Reflux.createStore({
	localStorage: "WorkspaceStore"
});

module.exports = WorkspaceStore;
