var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceStore = Reflux.createStore({
	localStorage: "WorkspaceStore2",
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
	onWorkflowStore: function(workflows){
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
				console.log('insert', insertObj);
				this.set(workflow.id, insertObj, {trigger: false});
			}
		}
		this.manualTrigger();
	},
	init:function(){
		console.log('init workspace');
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
	}
});

module.exports = WorkspaceStore;
