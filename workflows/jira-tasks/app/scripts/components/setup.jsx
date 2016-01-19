var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var Select = require('react-select');
var MainActions = require('../actions/MainActions');
var Setup = React.createClass({
	mixins: [MainStore.connect()],
	componentDidUpdate:function(){
		$.swDropdown();
	},
	componentDidMount:function(){
		//MainActions.loadProjects();
		$.swDropdown();
	},
	selectedProject: function(e){
		var value = e ? e.value : null;
		MainActions.updateSettings({projectKey: value});
	},
	selectedTodo: function(e){
		var value = e ? e.value : null;
		MainActions.updateSettings({todoId: value});
	},
	selectedProgress: function(e){
		var value = e ? e.value : null;
		MainActions.updateSettings({progressId: value});
	},
	selectedDone: function(e){
		var value = e ? e.value : null;
		MainActions.updateSettings({doneId: value});
	},
	goToApp:function(){
		MainActions.goToApp();
	},
	renderProjectPicker:function(){
		var getOptions = function(input, callback){
			swipes.service('jira').request('project.getAllProjects', function(res, err){
				if(res){
					var options = res.data.map(function(project){ return {value: project.key, label: project.name} });
					callback(null, {options: options, complete: true});
				}
				else{
					callback(err);
				}	
			})

		};
		return (
			<Select.Async value={swipes.info.workflow.settings.projectKey} loadOptions={getOptions} placeholder='Select Project' name="project-picker"  onChange={this.selectedProject}/>
		);
	},
	getColumnsForPicker: function(input, callback){
		console.log(swipes.info.workflow.settings.projectKey);
		swipes.service('jira').request('project.getStatuses', {projectIdOrKey: swipes.info.workflow.settings.projectKey}, function(res, err){
			if(res){
				var options = [];
				var keyCheck = {};
				for(var i = 0 ; i < res.data.length ; i++){
					var type = res.data[i];
					for(var j = 0 ; j < type.statuses.length ; j++){
						var status = type.statuses[j];
						if(!keyCheck[status.id]){
							keyCheck[status.id] = true;
							var obj = {value: status.id, label: status.name};
							options.push(obj);
						}
					}
				}
				callback(null, {options: options, complete: true});
			}
			else{
				callback(err);
			}	
		})
	},
	renderTodoPicker: function(){
		return (
			<Select.Async value={this.state.settings.todoId} loadOptions={this.getColumnsForPicker} placeholder='Select Todo Column' name="todo-picker"  onChange={this.selectedTodo}/>
		);
	},
	renderProgressPicker: function(){
		return (
			<Select.Async value={this.state.settings.progressId} loadOptions={this.getColumnsForPicker} placeholder='Select Progress Column' name="progress-picker"  onChange={this.selectedProgress}/>
		);
	},
	renderDonePicker: function(){
		return (
			<Select.Async value={this.state.settings.doneId} loadOptions={this.getColumnsForPicker} placeholder='Select Done Column' name="progress-picker"  onChange={this.selectedDone}/>
		);
	},
	renderColumnPickers: function(){
		if(this.state.settings.projectKey){
			var colClass = "col sm_3 md_2 lg_3 xlg_4";
			return (
				<div className="row">
					<div className="column-pickers">
						<div className={colClass}>
							<h4>Todo Column</h4>
							{this.renderTodoPicker()}
						</div>
						<div className={colClass}>
							<h4>Progress Column</h4>
							{this.renderProgressPicker()}
						</div>
						<div className={colClass}>
							<h4>Done Column</h4>
							{this.renderDonePicker()}
						</div>
					</div>
				</div>
			);
		}
	},
	renderGoToAppButton:function(){
		var disabled = false;
		var buttonClass = "col sm_3 md_3 lg_3 xlg_3 primary deepblue-100 rounded ";
		if(!this.state.settings.projectKey || !this.state.settings.doneId || !this.state.settings.todoId || !this.state.settings.progressId){
			disabled = true;
			buttonClass += "disabled";
		}
		return (
			<div className="row">
				<button onClick={this.goToApp} className={buttonClass} disabled={disabled}>Go to Workflow</button>
			</div>
		)
	},
	render: function() {
		console.log('ren', this.state.settings.todoId);
		return (
			<div className="setup">
				<h1>Setup</h1>
				<div className="row project-picker">
					<div className="col sm_3 md_6 lg_10 xlg_12">
						<h3>Choose Project</h3>
						{this.renderProjectPicker()}
					</div>
				</div>				
				{this.renderColumnPickers()}
				{this.renderGoToAppButton()}
			</div>
		);
	}
});


module.exports = Setup;