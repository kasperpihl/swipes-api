var Reflux = require('reflux');

var WorkspaceActions = Reflux.createActions([
	'moveCard',
	'updateCardSize',
	'gridButton',
	'sendCardToFront',
	'adjustForScreenSize',
	'enterLeaveDropOverlay',
	'introVideo',
	'showHideCard',
	'maximize',
	'resizeOnDrag',
	'removeMaximize'  // Here you can list your actions
]);

module.exports = WorkspaceActions;
