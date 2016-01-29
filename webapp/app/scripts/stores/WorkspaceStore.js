var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var WorkspaceStore = Reflux.createStore({
	listenables: [WorkspaceActions],
	localStorage: "WorkspaceStore2",
	sort: function(el){ return el._grid.i },
	getAvailableI:function(){
		// Get the next available i, this is to provide the grid system.
		// sort the i's and provide an array with them.
		var sortedI = _.map(_.sortBy(this.getAll(), function(el){ return el._grid.i; }), function(el) { return el._grid.i });
		for(var i = 0 ; i <= sortedI.length ; i++){
			// If we are at the end, return the length
			if(i === sortedI.length){
				return i;
			}
			// Otherwise, find the in betweens of free spots
			if(i != sortedI[i]){
				return i;
			}
		}
	},
	onSaveLayout:function(layout){ 
		// First make a key we can lookup objects based on the grid system's "i"
		var indexedByI = _.indexBy(this.getAll(), function(el){
			return el._grid.i;
		});
		// Iterate and update the _grid key for the workspace.
		_.each(layout, function(el){
			var workflowObj = indexedByI[el.i];
			this.update(workflowObj.workflow_id, {_grid: el}, {trigger:false});
		}.bind(this));

		this.manualTrigger();
	},
	onWorkflowStore: function(workflows, workflow2){
		// Hack to not run on first call, reflux stores send an empty array on initialize
		if(!this.hasGottenFirstLoad){
			this.hasGottenFirstLoad = true;
			return;
		}

		// Object indexed by the workflow_id to test if any has been removed from store.
		var testForRemovals = _.indexBy(this.getAll(), function(el){ return el.workflow_id });
		
		for(var i = 0 ; i < workflows.length ; i++){
			var workflow = workflows[i];
			// If the workflow is not found, insert a new record with the grid info.
			if(!this.get(workflow.id)){
				// K OR T_TODO: Make a better way to calculate x/y of new object!
				var insertObj = {
					workflow_id: workflow.id,
					_grid: {
						i: this.getAvailableI(),
						w: 4,
						h: 8,
						x: 0,
						y: 0
					}

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
	init:function(){
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
	}
});

module.exports = WorkspaceStore;
