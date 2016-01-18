var Reflux = require('reflux');

var IssueStore = Reflux.createStore({
	sort: 'index',
	fetch: function(){
		var self = this;
		swipes.service('jira').request('search.search', {
			jql: 'project = SWIP AND sprint is not EMPTY ORDER BY Rank ASC'
		}, function(res, err){
			console.log('jira2', res, err);
			if(res && res.ok){
				console.log('loading all these', res.data.issues);
				self.batchLoad(res.data.issues, {flush:true});
			}
		});
	},
	beforeSaveHandler: function(newObj, oldObj){
		// Don't have subtasks in the main store, they will be available under each issue
		if(newObj.fields.parent){
			return null;
		}
		if(typeof newObj.index === 'undefined'){
			newObj.index = _.size(this.getAll());
		}
		return newObj;
	}
});

module.exports = IssueStore;