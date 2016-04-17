var Reflux = require('reflux');

var TaskActions = Reflux.createActions([
  'expandDesc',
  'addAuthor',
  'addCreatedAt'
]);

//Sync actions
TaskActions.titleChange = Reflux.createAction({sync: true});
TaskActions.descriptionChange = Reflux.createAction({sync: true});

module.exports = TaskActions;
