var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var WorkspaceStore = Reflux.createStore({
	listenables: [WorkspaceActions],
	localStorage: "WorkspaceStore3",
	sort: function(el){ return el.id },
	onWorkflowStore: function(workflows, workflow2){
		// Hack to not run on first call, reflux stores send an empty array on initialize
		if(!this.hasGottenFirstLoad){
			this.hasGottenFirstLoad = true;
			return;
		}

		// Object indexed by the workflow_id to test if any has been removed from store.
		var testForRemovals = _.indexBy(this.getAll(), function(el){ return el.id });
		
		for(var i = 0 ; i < workflows.length ; i++){
			var workflow = workflows[i];
			// If the workflow is not found, insert a new record with the grid info.
			if(!this.get(workflow.id)){
				// K OR T_TODO: Make a better way to calculate x/y of new object!
				var insertObj = {
					id: workflow.id
				}
				this.set(workflow.id, insertObj, {trigger: false});
			}
			else{
				// Mark this as being here
				delete testForRemovals[workflow.id];
			}
		}

		// If any keys are left in the removal object, unset them!
		var keysToRemove = _.keys(testForRemovals);
		if(keysToRemove.length){
			this.unset(keysToRemove, {trigger:false});
		}
		
		this.manualTrigger();
	},
	onMoveCard:function(id, deltaCordinates){
		var obj = this.get(id);
		var x = obj.x + deltaCordinates.x;
		var y = obj.y + deltaCordinates.y;
		this.update(id, {x:x, y:y});
	},
	onUpdateCardSize: function(id, obj){
		var newSize = {};
		if(obj.w){
			newSize.w = obj.w;
		}
		if(obj.h){
			newSize.h = obj.h;
		}
		if(obj.x){
			newSize.x = obj.x;
		}
		if(obj.y){
			newSize.y = obj.y;
		}
		this.update(id, newSize);
	},
	onGridButton: function(){
		var i = 0;
		var screenWidth = window.innerWidth;
		var screenHeight = window.innerHeight;
		var eachWidth = screenWidth / 3;
		var padding = 10;
		_.each(this.getAll(), function(el){
			var newSize = {
				x: eachWidth*i + padding,
				y: padding,
				w: eachWidth - 2*padding,
				h: screenHeight-60-2*padding
			};
			this.update(el.id, newSize, {trigger:false});
			i++;
		}.bind(this));
		this.manualTrigger();
	},
	onSendCardToFront: function(id){
		this.update(id, {z: _.size(this.getAll())}, {trigger:false});
		this.onAdjustForScreenSize();
	},
	onAdjustForScreenSize: function(screenWidth, screenHeight){
		console.log('adjusting');
		var minimumWidthOnScreen = 100;
		var minimumHeightOnScreen = 50;
		var paddingForAutoAdjusting = 5;
		var didUpdate = false;
		var counter = 0;
		_.each(_.sortBy(this.getAll(), function(el){return el.z; }), function(el){
			var x = el.x;
			var y = el.y;
			var w = el.w;
			var h = el.h;
			var z = el.z;
			var newSize = {};
			
			// Check if something has been moved to the front
			if(z != counter){
				newSize.z = counter;
			}

			// Only run these if screen size was forwarded
			if(screenWidth && screenHeight){
				// Check if offscreen to the right off the screen
				if((x + w) > screenWidth){
					newSize.x = Math.max(screenWidth - w, paddingForAutoAdjusting);
				}
				// Check if offscreen in the bottom off the screen
				if((y + h) > screenHeight){
					newSize.y = Math.max(screenHeight - h, paddingForAutoAdjusting);
				}
				// Check if wider than the screen.
				if(w > (screenWidth - 2*paddingForAutoAdjusting)){
					newSize.w = (screenWidth - 2*paddingForAutoAdjusting);
				}
				// Check if higher than the current screen.
				if(h > (screenHeight - 2*paddingForAutoAdjusting)){
					newSize.h = (screenHeight - 2*paddingForAutoAdjusting);
				}
			}

			if(_.size(newSize) > 0){
				this.update(el.id, newSize, {trigger: false});
				didUpdate = true;
			}
			counter++;
		}.bind(this));
		if(didUpdate){
			this.manualTrigger();
		}
	},
	init: function(){
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
	},
	beforeSaveHandler:function(obj, oldObj){
		if(!oldObj){
			var num = _.size(this.getAll());
			obj.z = num;
			obj.x = 0;
			obj.y = 0;
			obj.w = 300;
			obj.h = 300;
		}
		return obj;
	}
});

module.exports = WorkspaceStore;
