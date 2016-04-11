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
  // http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  urlify: function () {
    var text = this.props.comment.text;
    var words = text.split(' ');
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var elements = [];

    words.forEach(function (word, index) {
      var url = null;

      word = word.replace(urlRegex, function(match) {
        url = match;
        return '';
      })

      elements.push(word + ' ');

      if (url !== null) {
        elements.push(<a target="_blank" href={url}>{url}</a>);
        elements.push(' ');
      }
    })

    return elements;
  },
  render: function () {
    var comment = this.props.comment;
    var allUsers = UserStore.getAll();
    var createdBy = comment['created_by'] || {};
    var user = allUsers[createdBy.id] || null;
    var time = moment(comment.created_at).format("h:mm a, d MMM YYYY");
    var textElements = this.urlify();

    return (
      <div className="task-comment-wrapper">
        <div className="task-comment-avatar" title={user.name}>
          <Avatar user={user} />
        </div>
        <div className="task-comment">
          <div className="comment">
            {textElements}
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
