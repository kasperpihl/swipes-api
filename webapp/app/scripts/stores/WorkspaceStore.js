var Reflux = require('reflux');
var WorkflowStore = require('./WorkflowStore');
var WorkspaceActions = require('../actions/WorkspaceActions');

var WorkspaceStore = Reflux.createStore({
	listenables: [WorkspaceActions],
	localStorage: "WorkspaceStore4",
	defaults: {
		_columns: []
	},
	getAllIdsInGrid(){
		var columns = this.get('_columns');
		var ids = [];
		if(!columns) return ids;

		columns.forEach(function(column){
			column.rows.forEach(function(row){
				ids.push(row.id);
			});
		});
		return ids;
	},
	addRowToGrid(row, options){
		var columns = this.get('_columns');
		if(columns.length && columns[columns.length-1].rows.length < 3){
			columns[columns.length-1].rows.push(row);
		}
		else{
			columns.push({rows: [row]});
		}
		this.set('_columns', columns, options);
	},
	removeFromGrid(ids, options){
		if(typeof ids === 'string'){
			ids = [ids];
		}
		var columns = this.get('_columns');

		var newCols = [];

		columns.forEach(function(column, colI){
			var newRows = [];
			column.rows.forEach(function(row, rowI){
				if(ids.indexOf(row.id) === -1){
					newRows.push(row);
				}
			});

			column.rows = newRows;
			if(newRows.length){
				newCols.push(column);
			}
		});
		this.set('_columns', newCols, options);
	},
	onWorkflowStore: function(workflows){

		// Hack to not run on first call, reflux stores send an empty array on initialize
		if(!this.hasGottenFirstLoad){
			this.hasGottenFirstLoad = true
			return;
		}
		// Test if any has been removed from store that is currently in the grid.
		var testForRemovals = this.getAllIdsInGrid();
		workflows.forEach(function(workflow, i){
			
			var index = testForRemovals.indexOf(workflow.id);
			if (index > -1) {
				testForRemovals.splice(index, 1);
			}
			else{
				this.addRowToGrid({id: workflow.id}, {trigger: false});
			}
		}.bind(this));

		if(testForRemovals.length){
			this.removeFromGrid(testForRemovals, {trigger: false});
		}

		this.manualTrigger();
	},

	init: function(){
		this.manualLoadData();
		this.listenTo(WorkflowStore, this.onWorkflowStore);
	}
});

module.exports = WorkspaceStore;
