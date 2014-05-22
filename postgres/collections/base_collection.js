var Backbone = require('backbone');

var BaseCollection = Backbone.Collection.extend({
	model:false,
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
			models.push(model);
		}
		this.add(models);
		this.on('invalid', function(model, error){

		})
	}
});

module.exports = BaseCollection;