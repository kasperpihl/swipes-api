var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');
var MainStore = require('../stores/MainStore');
var UserStore = require('../stores/UserStore');
var CommentsStore = require('../stores/CommentsStore');
var CommentsActions = require('../actions/CommentsActions');
var TasksStore = require('../stores/TasksStore');
var TasksActions = require('../actions/TasksActions');
var Loading = require('./loading');
var Avatar = require('./avatar');
var SwipesDot = require('swipes-dot').default;
var moment = require('moment');
var uuid = require('uuid');

var Comments = React.createClass({
  mixins: [CommentsStore.connect()],
  componentDidMount: function () {
    var task = this.props.task;

    // Get Attachments
    swipes.service('asana').request('attachments.findByTask', {
      id: task.id,
      opt_fields: 'download_url, name, view_url, created_at'
    })
    .then(function (res) {
      var stuff = res.data;
      var attachments = [];
      attachments = stuff;

      CommentsActions.getAttachments(attachments);
    })
    .catch(function (err) {
      console.log(err);
    });

    // Get comments
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
    });
  },
  renderAttachments: function() {
    var attachments = this.state.attachments;
    var elements = [];
    var task = this.props.task;

    attachments.forEach(function (attachment) {
      elements.push(<Attachment key={attachment.id} attachment={attachment} task={task}/>)
    })

    return elements;

  },
  renderComments: function () {
    var comments = this.state.comments;
    var attachments = this.state.attachments;
    var elements = [];
    var task = this.props.task;

    comments.forEach(function (comment) {
      elements.push(<Comment key={comment.id} comment={comment} task={task} />);
    })

    if (comments.length > 0 || attachments.length > 0) {
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
        {comments.length === null ? (
          <Loading style={{marginTop: '20%'}} />
				) : (
          <div>
            {this.renderAttachments()}
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

    swipes.share(shareData);
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
    var firstRow = [];
    var comment = this.props.comment;
    var task = this.props.task;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    firstRow.push({
      label: 'Share',
      icon: 'share',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        that.shareTaskUrl(comment.text);
      }
    });

    firstRow.push({
      label: 'Jump to asana',
      icon: 'link',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        window.open(taskUrl, '_blank');
      }
    });

    items.push(firstRow);

    return items;
  },
  renderSwipesDot: function() {
    var dotItems = this.dotItems();
    var comment = this.props.comment;

    return (
      <SwipesDot
        className="dot"
        reverse="true"
        onDragStart={this.onDotDragStart}
        hoverParentId={comment.id}
        elements={dotItems}
      />
    )
  },
  onDotDragStart: function(){
    var comment = this.props.comment;
    swipes.dot.startDrag(this.shareData(comment.text));
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

var Attachment = React.createClass({
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
    var firstRow = [];
    var comment = this.props.comment;
    var task = this.props.task;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    firstRow.push({
      label: 'Share',
      icon: 'share',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        that.shareTaskUrl(taskUrl);
      }
    });

    items.push(firstRow);

    return items;
  },
  onDotDragStart: function(){
    var settings = MainStore.get('settings');
    var task = this.props.task;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;
    swipes.dot.startDrag(this.shareData(taskUrl));
  },
  renderSwipesDot: function() {
    var dotItems = this.dotItems();
    var attachment = this.props.attachment;
    var that = this;
    var settings = MainStore.get('settings');
    var task = this.props.task;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    return (
      <SwipesDot
        className="dot"
        reverse="true"
        onDragStart={this.onDotDragStart}
        hoverParentId={attachment.id}
        elements={dotItems}
      />
    )
  },
  getFileType: function (fileExt) {
    var icon = './images/default.svg';

    var fileTypes = [
    	{
        // Actually image, but need to figure out how to display the image in a nice way
    		type: 'image',
    		fileType: [
    			'jpeg',
    	  	'jpg',
    	  	'png',
    	  	'gif',
    	  	'svg'
    		]
      },
    	{
    		type: 'audio',
    		fileType: [
    			'mp3',
    			'flac',
    			'm4a',
    			'ogg',
    			'wav',
    			'wma'
    		]
      },
    	{
    		type: 'video',
    		fileType: [
    			'webm',
    			'mkv',
    			'flv',
    			'mov',
    			'wmv',
    			'avi',
    			'mp4',
    			'mpeg',
    			'm4v'
    		]
      },
    	{
    		type: 'document',
    		fileType: [
    			'pdf',
    			'doc',
    			'docx',
    			'xls',
    			'xlsx',
    			'ptt',
    			'pttx',
    			'txt',
    			'rtf',
    			'key',
    			'pages',
    			'numbers'
    		]
      },
    	{
    		type: 'code',
    		fileType: [
    			'js',
    			'html',
    			'css',
    			'php'
    		]
      },
    	{
    		type: 'design',
    		fileType: [
    			'ai',
    			'psd',
    			'sketch',
    			'prd',
    			'aep',
    			'prproj'
    		]
      },
    ]

    fileTypes.forEach( function(item) {
    	if(item.fileType.indexOf(fileExt) > -1) {
    		icon = './images/' + item.type + '.svg';
    	}
    })

    return icon;
  },
  render: function () {
    var attachment = this.props.attachment;
    var time = moment(attachment.created_at).fromNow();
    var getExt = attachment.name.split('.')[1].toLowerCase();
    var icon = this.getFileType(getExt);

    return (
      <div id={attachment.id} className="task-comment-wrapper">

        <div className="task-comment-avatar attachment">
          <img src={icon}/>
        </div>

        <div className="task-comment">

          <div className="comment">
            <a href={attachment.download_url} target="_blank">
              {attachment.name}
            </a>
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
