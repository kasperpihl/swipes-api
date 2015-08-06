// Defining all the collections - for accessing from other classes

var TodoCollection = require('./todo_collection.js');
var TagCollection = require('./tag_collection.js');
var MemberCollection = require('./member_collection.js');
var ProjectCollection = require('./project_collection.js');
var MessageCollection = require('./message_collection.js');

module.exports = {
	Todo: TodoCollection,
	Tag: TagCollection,
	Member: MemberCollection,
	Project: ProjectCollection,
	Message: MessageCollection
};