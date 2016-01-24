var Reflux = require('reflux');
var me;
var IssueActions = require('../actions/IssueActions');
var NotificationActions = require('../actions/NotificationActions');
var MainStore = require('./MainStore');
var IssueStore = Reflux.createStore({
	listenables: [IssueActions],
	sort: 'index',
	getCurrentIssue: function(){
		return _.find(this.getAll(), {isCurrent: true});
	},
	refetch: function(){
		if(this.refetchTimer){
			clearTimeout(this.refetchTimer);
		}
		console.log('refetching');
		this.fetch();
	},
	fetch: function(){
		var self = this;
		if(this.isFetching){
			return;
		}
		this.isFetching = true;
		return swipes.service('jira').request('myself.getMyself').then(function(res){
			me = res.data;
			return swipes.service('jira').request('search.search', {
				jql: 'project = ' + MainStore.get('settings').projectKey + ' AND assignee = currentUser() AND sprint is not EMPTY ORDER BY Rank ASC'
			});
		}).then(function(res){
			self.isFetching = false;
			if(!self.lockFetching){
				self.batchLoad(res.data.issues, {flush:true});
			}
			self.refetchTimer = setTimeout(self.refetch.bind(self)
			, 10000);
		}).catch(function(err){
			self.isFetching = false;
			console.log('err issue stor', err);
		})
	},
	onWorkOnIssue:function(issueId){
		var progressId = MainStore.get('settings').progressId; // T_TODO:/K_TODO: Make this part of the settings, which id is the progress one 
		return this.transitionToId(issueId, progressId);
		
	},
	onStopWorkOnIssue: function(issueId){
		var todoId = MainStore.get('settings').todoId;
		return this.transitionToId(issueId, todoId);
	},
	onCompleteWorkOnIssue: function(issueId){
		var doneId = MainStore.get('settings').doneId;
		return this.transitionToId(issueId, doneId);
	},
	onAssignPersonToIssue: function(issueId, assignee){
		var self = this;
		this.lockFetching = true;
		swipes.service('jira').request('issue.assignIssue', {
			issueId: issueId,
			assignee: assignee.name
		}).then(function(res){
			NotificationActions.sendNotification('Assigned person: ' + assignee.name);
			var issue = self.get(issueId);
			self.unset(issueId);
			self.onStopWorkOnIssue(issueId);
		}).catch(function(err){
			self.lockFetching = false;
			console.log('err assigning', err);
		})
	},
	transitionToId: function(issueId, columnId){
		var self = this;
		var transObj;
		this.lockFetching = true;
		return swipes.service('jira').request('issue.getTransitions', { 
			issueId: issueId
		}).then(function(res){
			var transitionId;
			for(var i = 0 ; i < res.data.transitions.length ; i++){
				var trans = res.data.transitions[i];
				if(trans.to.id === columnId){
					transObj = trans.to;
					transitionId = trans.id;
				}
			}
			return swipes.service('jira').request('issue.transitionIssue', {
				issueId: issueId, transition: transitionId
			});
		}).then(function(res){
			self.lockFetching = false;
			var issue = self.get(issueId);
			NotificationActions.sendNotification('Moved issue: ' + transObj.name);
			if(issue){
				issue.fields.status = transObj;
				self.set(issueId, issue);	
			}
		}).catch(function(err){
			self.lockFetching = false;
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
		var todoId = MainStore.get('settings').todoId;
		var progressId = MainStore.get('settings').progressId;
		if(_.indexOf([todoId, progressId], newObj.fields.status.id) === -1){
			return null;
		}
		newObj.isCurrent = (progressId === newObj.fields.status.id);

		// This is a hack to keep a sorted index, jira doesn't provide any indexes
		if(typeof newObj.index === 'undefined'){
			newObj.index = _.size(this.getAll());
		}
		return newObj;
	}
});

module.exports = IssueStore;