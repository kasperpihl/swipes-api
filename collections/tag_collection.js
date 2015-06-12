var BaseCollection = require('./base_collection.js');
var Models = require('../models/models.js');

var TagCollection = BaseCollection.extend({
	model: Models.Tag
});

module.exports = TagCollection;