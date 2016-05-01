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
		var testForRemovals = _.indexBy(this._dataById, function(el, index){ return index; });

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
				// This is an ugly hack, but it works
				// Kasper, where do you set the init workflow?
				var insertObj = {
					parent_id: workflow.parent_id,
					index_url: workflow.index_url,
					icon: workflow.icon
				}

				this.update(workflow.id, insertObj, {trigger: false});
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
	onEnterLeaveDropOverlay: function (id, enter) {
		this.update(id, {hoverDropOverlay: enter});
	},
	onMoveCard:function(id, deltaCordinates){
		var obj = this.get(id);
		var x = obj.x + deltaCordinates.x;
		var y = obj.y + deltaCordinates.y;
		if(id){
			this.update(id, {x:x, y:y});
		}
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
		if(id){
			this.update(id, newSize);
		}
	},
	onGridButton: function(){
		var i = 0;
		var el = document.getElementById('actual-app');
		var screenWidth = el.clientWidth;
		var screenHeight = el.clientHeight;
		var eachWidth = screenWidth / _.size(this.getAll());
		var padding = 10;
		var sortedCards = _.sortBy(this.getAll(), function(el){ return el.x });

		var hasSlack = false;
		var hasAsana = false;
		var firstIsSlack = false;
		if(sortedCards.length === 2){
			
			if(sortedCards[0].id && sortedCards[1].id){
				var firstCard = WorkflowStore.get(sortedCards[0].id);
				var secondCard = WorkflowStore.get(sortedCards[1].id);
				if(firstCard.manifest_id === "slack-dashboard" || secondCard.manifest_id === "slack-dashboard"){
					hasSlack = true;
					if(firstCard.manifest_id === "slack-dashboard"){
						firstIsSlack = true;
					}
				}
				if(firstCard.manifest_id === "asana-card" || secondCard.manifest_id === "asana-card"){
					hasAsana = true;
				}
			}
			

		}
		_.each(sortedCards, function(el){
			var newSize;
			if(hasAsana && hasSlack){
				var oneThird = screenWidth / 3;
				var twoThirds = screenWidth / 3 * 2;
				var slackSize = {
					x: padding,
					y: padding,
					w: twoThirds - 2*padding,
					h: screenHeight-2*padding
				};
				var asanaSize = {
					x: twoThirds + padding,
					y: padding,
					w: oneThird - 2*padding,
					h: screenHeight - 2*padding
				};
				newSize = asanaSize;
				if(i === 0 && firstIsSlack || i === 1 && !firstIsSlack){
					newSize = slackSize;
				}
			}
			else{
				newSize = {
					x: eachWidth*i + padding,
					y: padding,
					w: eachWidth - 2*padding,
					h: screenHeight-2*padding
				};
			}
			this.update(el.id, newSize, {trigger:false});
			i++;
		}.bind(this));
		this.manualTrigger();
	},
	onSendCardToFront: function(id){
		if(id){
			this.update(id, {z: _.size(this.getAll())}, {trigger:false});
			this.onAdjustForScreenSize();
		}
	},
	onAdjustForScreenSize: function(){
		var minimumWidthOnScreen = 100;
		var minimumHeightOnScreen = 50;
		var paddingForAutoAdjusting = 5;
		var didUpdate = false;
		var counter = 0;
		var screenWidth = document.getElementById("actual-app").clientWidth;
        var screenHeight = document.getElementById("actual-app").clientHeight;
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
				var minWidth = 400;
				var minHeight = 300;

				var underflowX = -x;
				var underflowY = -y;
				var overflowX = w - (screenWidth - x);
				var overflowY = h - (screenHeight - y);


				if(underflowX > 0){
					newSize.w = w = Math.max(minWidth, w - underflowX - paddingForAutoAdjusting);
				}
				if(x < 0){
					newSize.x = x = paddingForAutoAdjusting;
				}


				if(underflowY > 0){
					newSize.h = h = Math.max(minHeight, h - underflowY - paddingForAutoAdjusting);
				}
				if(y < 0){
					newSize.y = y = paddingForAutoAdjusting;
				}


				if(overflowX > 0){
					newSize.w = w = Math.max(minWidth, (w - overflowX - paddingForAutoAdjusting) );
				}
				if((x + w) > screenWidth){
					newSize.x = Math.max(screenWidth - w, paddingForAutoAdjusting);
				}

				// Check if offscreen in the bottom off the screen
				if(overflowY > 0){
					newSize.h = h = Math.max(minHeight, (h - overflowY - paddingForAutoAdjusting) );
				}
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

			if(_.size(newSize) > 0 && el.id){
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
		this.bouncedGridPress = _.debounce(this.onGridButton, 50);
	},
	beforeSaveHandler:function(newObj, oldObj){
		if(!oldObj && newObj.id){
			var num = _.size(this.getAll());
			newObj.z = num;
			newObj.x = 0;
			newObj.y = 0;
			newObj.w = 300;
			newObj.h = 300;
			this.bouncedGridPress();
		}
		return newObj;
	}
});

module.exports = WorkspaceStore;
