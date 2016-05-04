var Reflux = require('reflux');

var WorkflowActions = Reflux.createActions([
  'removeWorkflow',
  'renameWorkflow',
  'selectAccount'
  // Here you can list your actions
]);

module.exports = WorkflowActions;
