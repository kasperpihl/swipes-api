var Reflux = require('reflux');

var SidebarActions = Reflux.createActions([
	'loadUserModal',
	'loadChannelModal',
	'loadAppModal'
]);

module.exports = SidebarActions;
