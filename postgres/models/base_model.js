var Backbone = require('backbone');

var BaseModel = Backbone.Model.extend({
	action: 'insert',
	getAttributeUpdateArrayFromData:function( data, userId){
		var attributeUpdates = { updatedAt: "now()" };
		var identifier = data.objectId;
		if ( !identifier )
			identifier = data.tempId;
		if( identifier )
			attributeUpdates.localId = identifier;
		if( !userId )
			attributeUpdates.userId = userId;

		if ( data.deleted )
			attributeUpdates.deleted = true;

		return attributeUpdates;
	}
});

module.exports = BaseModel;