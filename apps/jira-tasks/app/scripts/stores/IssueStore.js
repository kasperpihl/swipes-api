var Reflux = require('reflux');

var IssueStore = Reflux.createStore({
	sort: 'index',
	fetch: function(){
		var self = this;
		swipes.service('jira').request('search.search', {
			jql: 'project = SWIP AND sprint is not EMPTY ORDER BY Rank ASC'
		}, function(err, res){
			console.log('jira2', res, err);
			if(res && res.issues){
				console.log('loading all these', res.issues);
				self.batchLoad(res.issues, {flush:true});
			}
		});
	},
	beforeSaveHandler: function(newObj, oldObj){
		if(typeof newObj.index === 'undefined'){
			newObj.index = _.size(this.getAll());
		}
		return newObj;
	}
});

module.exports = IssueStore;