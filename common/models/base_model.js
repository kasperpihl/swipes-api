var Backbone = require('backbone');

var BaseModel = Backbone.Model.extend({
	action: 'insert',
	error: null,
	
	getAttributeUpdateArrayFromData:function( data, userId){
		var attributeUpdates = {};
		var identifier = data.objectId;
		if ( !identifier )
			identifier = data.tempId;
		if( identifier )
			attributeUpdates.localId = identifier;
		if( userId )
			attributeUpdates.userId = userId;

		if ( data.deleted )
			attributeUpdates.deleted = true;

		return attributeUpdates;
	},
	toJSON: function( options ){
		var toJSON = Backbone.Model.prototype.toJSON.apply( this, arguments );
		// If object is to be updated, then remove database and localId - already there!
		if ( toJSON['databaseId'] ){
			delete toJSON['localId'];
			delete toJSON['databaseId'];
		}
		return toJSON;
	}
});

module.exports = BaseModel;