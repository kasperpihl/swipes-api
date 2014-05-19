var BaseModel = require('./base_model.js');

var TagModel = BaseModel.extend({
	tableName: "tag",
	className: "Tag"
});

module.exports = TagModel;