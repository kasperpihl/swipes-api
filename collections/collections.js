// Defining all the collections - for accessing from other classes

var TodoCollection = require('./todo_collection.js');
var TagCollection = require('./tag_collection.js');

module.exports = {
	Todo: TodoCollection,
	Tag: TagCollection
};