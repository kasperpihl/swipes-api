// Defining all the models - for accessing from other classes
var TodoModel = require('./todo_model.js');
var TagModel = require('./tag_model.js');
var MemberModel = require('./member_model.js');
var ProjectModel = require('./project_model.js');
var MessageModel = require('./message_model.js');

module.exports = {
	Todo: TodoModel,
	Tag: TagModel,
	Project: ProjectModel,
	Member: MemberModel,
	Message: MessageModel
};