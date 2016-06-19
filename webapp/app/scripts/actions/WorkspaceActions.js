var Reflux = require('reflux');

var WorkspaceActions = Reflux.createActions([
	'moveCard',
	'updateCardSize',
	'enterLeaveDropOverlay',
	'introVideo',
	'showHideCard',
	'maximize',
	'resizeOnDrag',
	'removeMaximize',
	'setNotifications'  // Here you can list your actions
]);

module.exports = WorkspaceActions;
