var Reflux = require('reflux');

var WorkflowActions = Reflux.createActions([
  'removeWorkflow',
  'renameWorkflow'
  // Here you can list your actions
]);

module.exports = WorkflowActions;
