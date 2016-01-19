var Reflux = require('reflux');
var me;
var IssueActions = require('../actions/IssueActions');
var MainStore = require('./MainStore');
var IssueStore = Reflux.createStore({
	listenables: [IssueActions],
	sort: 'index',
	fetch: function(){
		var self = this;
		swipes.service('jira').request('myself.getMyself').then(function(res){
			me = res.data;
			console.log(me.name);
			return swipes.service('jira').request('search.search', {
				jql: 'project = ' + MainStore.get('settings').projectKey + ' AND sprint is not EMPTY ORDER BY Rank ASC'
			});
		}).then(function(res){

			self.batchLoad(res.data.issues, {flush:true});
		
		}).catch(function(err){
			console.log('err issue stor', err);
		})

	},
	onWorkOnIssue:function(issueId){
		var progressId = MainStore.get('settings').progressId; // T_TODO:/K_TODO: Make this part of the settings, which id is the progress one 
		this.transitionToId(issueId, progressId);
		this.update(issueId, {'state': 'inprogress'});
	},
	onStopWorkOnIssue: function(issueId){
		var todoId = MainStore.get('settings').todoId;
		this.transitionToId(issueId, todoId);
		this.update(issueId, {'state': 'todo'});
	},
	onCompleteWorkOnIssue: function(issueId){
		var doneId = MainStore.get('settings').doneId;
		this.transitionToId(issueId, doneId);
		this.update(issueId, {'state': 'done'});
	},
	transitionToId: function(issueId, columnId){
		swipes.service('jira').request('issue.getTransitions', { 
			issueId: issueId 
		}).then(function(res){
			console.log(res.data);
			var transitionId;
			for(var i = 0 ; i < res.data.transitions.length ; i++){
				var trans = res.data.transitions[i];
				if(trans.to.id === columnId){
					transitionId = trans.id;
				}
			}
			return swipes.service('jira').request('issue.transitionIssue', {
				issueId: issueId, transition: transitionId
			});
		}).catch(function(err){
			console.log('err work on issue', err);
		});
	},
	beforeSaveHandler: function(newObj, oldObj){
		// Don't have subtasks in the main store, they will be available under each issue
		if(newObj.fields.parent){
			return null;
		}
		// For now don't save tasks that's not mine.
		if(!newObj.fields.assignee || newObj.fields.assignee.key !== me.key){
			return null;
		}
		// This is a hack to keep a sorted index, jira doesn't provide any indexes
		if(typeof newObj.index === 'undefined'){
			newObj.index = _.size(this.getAll());
		}
		return newObj;
	}
});

module.exports = IssueStore;