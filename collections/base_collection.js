var Backbone = require('backbone');

var BaseCollection = Backbone.Collection.extend({
	model:false,
	insertions: function(){
		
	},
	updates: function(){

	},
	loadObjects: function( objects, userId ){
		var models = [];
		this.errorModels = new Array();
		for ( var i in objects ){
			var data = objects[ i ];
			if(data === null || !data)
				continue;
			var model = new this.model();
			
			model.parseRawData( data, userId );
			if( !model.get("validationError") )
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