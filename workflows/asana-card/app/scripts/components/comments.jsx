var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');
var UserStore = require('../stores/UserStore');
var CommentsStore = require('../stores/CommentsStore');
var CommentsActions = require('../actions/CommentsActions');
var Loading = require('./loading');
var Avatar = require('./avatar');
var SwipesDot = require('swipes-dot').default;
var moment = require('moment');

var Comments = React.createClass({
  mixins: [CommentsStore.connect()],
  componentDidMount: function () {
    var task = this.props.task;

    swipes.service('asana').request('tasks.stories', {
      id: task.id
    })
    .then(function (res) {
      var stories = res.data;
      var comments = [];

      comments = stories.filter(function (story) {
        return story.type === 'comment';
      })
      console.log(comments)
      CommentsActions.load(comments);
    })
    .catch(function (err) {
      console.log(err);
    })
  },
  renderComments: function () {
    var comments = this.state.comments;
    var elements = [];

    comments.forEach(function (comment) {
      elements.push(<Comment key={comment.id} comment={comment} />);
    })

    if (elements.length > 0) {
      return elements;
    } else {
      return (
        <div className="empty-state asana">
          <img src="./images/swipes-ui-workspace-emptystate-task.svg" />
          <p>No comments yet. <br /> Why don't you get this conversation rocking?</p>
        </div>
      )
    }
  },
  render: function () {
    var comments = this.state.comments;

    return (
      <div>
        {comments === null ? (
          <Loading style={{marginTop: '20%'}} />
				) : (
          <div>
            {this.renderComments()}
					</div>
				)}
      </div>
    )
  }
});

var Comment = React.createClass({
  render: function () {
    var comment = this.props.comment;
    var allUsers = UserStore.getAll();
    var createdBy = comment['created_by'] || {};
    var user = allUsers[createdBy.id] || null;
    var time = moment(comment.created_at).format("h:mm a, d MMM YYYY");
    return (
      <div className="task-comment-wrapper">
        <div className="task-comment-avatar" title={user.name}>
          <Avatar user={user} />
        </div>
        <div className="task-comment">
          <div className="comment">
            {comment.text}
          </div>
          <div className="time">
            {time}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Comments;
