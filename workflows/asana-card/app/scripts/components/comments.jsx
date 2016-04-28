var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');
var MainStore = require('../stores/MainStore');
var UserStore = require('../stores/UserStore');
var CommentsStore = require('../stores/CommentsStore');
var CommentsActions = require('../actions/CommentsActions');
var Loading = require('./loading');
var Avatar = require('./avatar');
var SwipesDot = require('swipes-dot').default;
var moment = require('moment');
var uuid = require('uuid');

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
    var task = this.props.task;

    comments.forEach(function (comment) {
      elements.push(<Comment key={comment.id} comment={comment} task={task} />);
    })

    if (elements.length > 0) {
      elements.reverse();
      return elements;
    } else {
      return (
        <div className="empty-state asana" style={{marginTop: '10%'}}>
          <img src="./images/emptystate-asana-comments.svg" />
          <p><span className="bold">This is a place to leave comments</span> <br /> Write down your thoughts</p>
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
      var space = ' ';
      word = word.replace(urlRegex, function(match) {
        url = match;
        return '';
      })

      elements.push(word + ' ');

      if (url !== null) {
        elements.push(<a className="comments-url" target="_blank" key={uuid.v4()} href={url}>{url}</a>);
        elements.push(<span key={uuid.v4()}>{space}</span>);
      }
    })

    return elements;
  },
  shareTaskUrl: function (taskUrl) {
    var shareData = this.shareData(taskUrl);

    swipes.share.request(shareData);
  },
  shareData: function (taskUrl) {
    return {
      url: taskUrl
    }
  },
  dotItems: function () {
    var that = this;
    var settings = MainStore.get('settings');
    var items = [];
    var comment = this.props.comment;
    var task = this.props.task;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;


    items = items.concat([
      {
        label: 'Share the comment',
        icon: 'share',
        callback: function () {
          that.shareTaskUrl(comment.text);
        }
      },
      {
        label: 'Jump to asana',
        icon: 'link',
        callback: function () {
          window.open(taskUrl, '_blank');
        }
      }
    ]);

    return items;
  },
  renderSwipesDot: function() {
    var dotItems = this.dotItems();
    var comment = this.props.comment;

    return (
      <SwipesDot
        className="dot"
        reverse="true"
        onDragData={this.shareData.bind(this, comment.text)}
        hoverParentId={comment.id}
        elements={dotItems}
        menuColors={{
          borderColor: 'transparent',
          hoverBorderColor: '#1DB1FC',
          backgroundColor: '#1DB1FC',
          hoverBackgroundColor: 'white',
          iconColor: 'white',
          hoverIconColor: '#1DB1FC'
        }}
        labelStyles={{
          transition: '.1s',
          boxShadow: 'none',
          backgroundColor: 'rgba(0, 12, 47, 1)',
          padding: '5px 10px',
          top: '-12px',
          fontSize: '16px',
          letterSpacing: '1px',
          zIndex: '99'
        }}
      />
    )
  },
  render: function () {
    var comment = this.props.comment;
    var allUsers = UserStore.getAll();
    var createdBy = comment['created_by'] || {};
    var user = allUsers[createdBy.id] || null;
    var time = moment(comment.created_at).fromNow();
    var textElements = this.urlify();

    return (
      <div id={comment.id} className="task-comment-wrapper">

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

        <div className="task-comment-dot">
          {this.renderSwipesDot()}
        </div>

      </div>
    )
  }
});

module.exports = Comments;
