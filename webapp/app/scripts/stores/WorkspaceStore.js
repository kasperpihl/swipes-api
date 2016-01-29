var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var WorkspaceStore = Reflux.createStore({
	listenables: [WorkspaceActions],
	localStorage: "WorkspaceStore2",
	sort: function(el){ return el._grid.i },
	getAvailableI:function(){
		var sortedI = _.map(_.sortBy(this.getAll(), function(el){ return el._grid.i; }), function(el) { return el._grid.i });
		for(var i = 0 ; i <= sortedI.length ; i++){
			if(i === sortedI.length){
				return i;
			}
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
		_.each(layout, function(el){
			var workflowObj = indexedByI[el.i];
			this.update(workflowObj.workflow_id, {_grid: el}, {trigger:false});
		}.bind(this));

		this.manualTrigger();
	},
	onWorkflowStore: function(workflows){
		// Everytime the store updates, make sure to insert new workflows
		// K_TODO: Fix that it also unset a workflow if it no longer exists
		for(var i = 0 ; i < workflows.length ; i++){
			var workflow = workflows[i];
			if(!this.get(workflow.id)){
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
		}
		this.manualTrigger();
	},
	init:function(){
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
	}
});

module.exports = WorkspaceStore;
