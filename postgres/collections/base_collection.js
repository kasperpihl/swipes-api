var Backbone = require('backbone');

var BaseCollection = Backbone.Collection.extend({
	model:false,
	errorModels:[],
	insertions: function(){
		
	},
	updates: function(){

	},
	loadObjects: function( objects, userId ){
		var models = [];
		for ( var i in objects ){
			var model = new this.model();
			var data = objects[ i ];
			model.parseRawData( data, userId );
			if( !model.validationError )
				models.push(model);
			else{
				this.errorModels.push(model);
			}
		}
		this.add(models);
		this.on('invalid', function(model, error){

		})
	}
});

module.exports = BaseCollection;