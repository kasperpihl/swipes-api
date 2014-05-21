var BaseCollection = require('./base_collection.js');
var Models = require('../models/models.js');
var TodoCollection = BaseCollection.extend({
	model: Models.Todo
});

module.exports = TodoCollection;