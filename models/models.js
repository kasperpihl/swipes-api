// Defining all the models - for accessing from other classes
var TodoModel = require('./todo_model.js');
var TagModel = require('./tag_model.js');

module.exports = {
	Todo: TodoModel,
	Tag: TagModel
};