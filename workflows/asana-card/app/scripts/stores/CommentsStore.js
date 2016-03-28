var Reflux = require('reflux');
var CommentsActions = require('../actions/CommentsActions');

var CommentsStore = Reflux.createStore({
  listenables: [CommentsActions],
  getInitialState: function () {
    return {
      comments: null
    }
  },
  onCreate: function (comment) {
    var comments = this.get('comments');

    comments.unshift(comment);
    this.set('comments', comments);
  },
  onLoad: function (comments) {
    this.set('comments', comments);
  }
});

module.exports = CommentsStore;
