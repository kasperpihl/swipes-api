var TodoModel = require('./todo_model.js');
var TagModel = require('./tag_model.js');
var TodoTagModel = require('./todo_tag_model.js');

module.exports = {
	Todo: TodoModel,
	Tag: TagModel,
	TodoTag: TodoTagModel
};