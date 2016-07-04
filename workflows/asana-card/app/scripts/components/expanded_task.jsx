var React = require('react');
var Reflux = require('reflux');
var FontIcon = require('material-ui/lib/font-icon');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var Loading = require('./loading');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var TasksStore = require('../stores/TasksStore');
var CommentsStore = require('../stores/CommentsStore');
var TaskStore = require('../stores/TaskStore');
var UserStore = require('../stores/UserStore');
var TaskActions = require('../actions/TaskActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var AssigneeMenu = require('./assignee_menu');
var Subtasks = require('./subtasks');
var SwipesDot = require('swipes-dot').default;
var Comments = require('./comments');
var moment = require('moment');

var MAX_DESC_LEN = 140;

var Textarea = require('react-textarea-autosize');

var tabsStyles = {
  singleTab: {
    backgroundColor: 'transparent',
		color: '#333D59',
		borderBottom: '1px solid #F4F4F5',
		position: 'relative',
		zIndex: '99',
    maxHeight: '100%',
    overflowY: 'auto'
  },
	inkBarStyle: {
		height: '30px',
		marginTop: '-30px',
		position: 'relative',
		zIndex: '1',
		backgroundColor: 'white'
	}
};

var ExpandedTask = React.createClass({
  mixins: [TasksStore.connect(), CommentsStore.connect(), TaskStore.connect(), UserStore.connect()],
  componentDidMount: function() {
    var loaded = TasksStore.get('loaded');
    var taskId = this.props.taskId;

    if (!loaded) {
      var tasksCache = TasksStore.getCachedTasks();

      if (tasksCache.length > 0) {
        TasksActions.loadTasks(tasksCache);
      } else {
        ProjectDataActions.fetchData();
      }
    }

    var storyPromise = swipes.service('asana').request('stories.findByTask', {
      id: taskId
    }).then(function(story) {
      TaskActions.addAuthor(story.data[0].created_by.name);
      TaskActions.addCreatedAt(story.data[0].created_at);
    })
  },
  componentWillUnmount: function () {
    TaskActions.titleChange(null);
    TaskActions.descriptionChange(null);
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    var tasks = TasksStore.get('tasks');
    var taskId = nextProps.taskId;
    var task = tasks.filter(function (task) {
      return task.id === taskId;
    })[0];

    if (!task) {
      return false;
    }

    return true;
  },
  goBack: function () {
    MainActions.closeExpandedTask();
  },
  shareTaskUrl: function (taskUrl) {
    var shareData = this.shareData(taskUrl);

    swipes.sendEvent('share', shareData);
  },
  shareData: function (taskUrl) {
    return {
      url: taskUrl
    }
  },
  removeTask: function (task) {
    ProjectDataActions.removeTask(task);
    MainActions.closeExpandedTask();
  },
  completeTask: function (task) {
    ProjectDataActions.completeTask(task);
  },
  undoCompleteTask: function (task) {
    ProjectDataActions.undoCompleteTask(task);
  },
  scheduleTask: function(task, taskId) {
    ProjectDataActions.scheduleTask(task, taskId);
  },
  dotItems: function (task) {
    var that = this;
    var items = [];
    var firstRow = [];
    var secondRow = [];
    var settings = MainStore.get('settings');
    var taskId = this.props.taskId;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    if (task.completed) {
      firstRow.push({
        label: 'Undo',
        icon: 'undo',
        bgColor: 'rgb(56,182,131)',
        callback: function () {
          that.undoCompleteTask(task);
        }
      });
    } else {
      firstRow.push({
        label: 'Complete',
        icon: 'check',
        bgColor: 'rgb(56,182,131)',
        callback: function () {
          that.completeTask(task);
        }
      });
    }

    firstRow.push({
      label: 'Schedule task',
      icon: 'schedule',
      bgColor: 'rgb(26,168,252)',
      callback: function () {
        that.scheduleTask(task, task.id);
      }
    })

    firstRow.push({
      label: 'Remove',
      icon: 'delete',
      bgColor: 'rgb(252,58,28)',
      callback: function () {
        that.removeTask(task);
      }
    });

    secondRow.push({
      label: 'Share section',
      icon: 'share',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        that.shareTaskUrl(taskUrl);
      }
    });

    secondRow.push({
      label: 'Jump to asana',
      icon: 'link',
      bgColor: 'rgb(255,197,37)',
      callback: function () {
        window.open(taskUrl, '_blank');
      }
    });

    items.push(firstRow);
    items.push(secondRow);

    return items;
  },
  saveDescripton: function() {
    var newDescription = this.refs.desci.value;
    var taskId = this.props.taskId;

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      notes: newDescription
    })
    // TODO handle errors
  },
  saveTitle: function() {
    var newTitle = this.refs.headerTitle.value;
    var taskId = this.props.taskId;

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      name: newTitle
    })
    // TODO handle errors
  },
  onTitleChange: function(event){
    TaskActions.titleChange(event.target.value);
  },
  onDescriptionChange: function(event){
    TaskActions.descriptionChange(event.target.value);
  },
  onDescriptionKeyDown: function(e){
    if(e.keyCode === 27){
      this.refs.desci.blur();
    }
  },
  onTitleKeyDown: function(e){
    if(e.keyCode === 13 || e.keyCode === 27){
      this.refs.headerTitle.blur();
    }
  },
  renderExpander: function(description) {
    if (description && description.length > 0) {
      var expandIcon = this.state.expandDesc ? 'keyboard_arrow_up' : 'keyboard_arrow_down';

      return (
        <div className="expand-description" onClick={this.expandDescription}>
          <FontIcon className="material-icons">{expandIcon}</FontIcon>
        </div>
      )
    }
  },
  expandDescription: function () {
    var expandState = !this.state.expandDesc;

    if (expandState === true) {
      this.refs.desci.focus();
    }
  },
  expandDescriptionOnFocus: function() {
    TaskActions.expandDesc(true);
  },
  descriptionOnBlur: function() {
    TaskActions.expandDesc(false);
    this.saveDescripton();
  },
  onActiveTab: function (tab) {
    var label = tab.props.label;

    if (label === 'Subtasks') {
      MainActions.commentsView(false);
    } else {
      MainActions.commentsView(true);
    }
  },
  renderTitle: function(task){
    return (
      <Textarea
        ref="headerTitle"
        className="header-title"
        onKeyUp={this.onTitleKeyUp}
        onKeyDown={this.onTitleKeyDown}
        onChange={this.onTitleChange}
        onBlur={this.saveTitle}
        placeholder="Add title"
        value={this.state.titleInputValue || task.name}
        minRows={1}
        maxRows={10}/>
    );
  },
  renderDueOnDate: function(task) {
    var dueOnText;

    if (!task.due_at) {
    } else {
      var taskDue = task.due_at;
      var parseDate = moment(taskDue).format('Do MMMM YYYY, hh:mma');
      return (
        <div className="task-due-on">{'Due on ' + parseDate}</div>
      )
    }
  },
  renderDescription: function (task) {
    var description = task.notes;
    var value = this.state.descriptionInputValue;
    var finalDescription = value !== null ? value : description;
    var maxRows = 1;
    // Increase max number of rows if expanded.
    if(this.state.expandDesc){
      maxRows = 15;
    }
    /*if (description.length > MAX_DESC_LEN && !this.state.expandDesc) {
      description = description.substring(0,140) + '...';
      value = description;
    }*/

    return (
      <div>
        <Textarea
          className="header-description"
          ref="desci"
          onFocus={this.expandDescriptionOnFocus}
          onChange={this.onDescriptionChange}
          onBlur={this.descriptionOnBlur}
          onKeyDown={this.onDescriptionKeyDown}
          placeholder="No description"
          value={finalDescription}
          minRows={1}
          maxRows={maxRows}/>
        {this.renderExpander(description)}
      </div>
    );
  },
  renderExtraData: function(task) {
    var time = moment(this.state.createdAt).format("h:mm a, d MMM YYYY");
    var verboseTime = moment(this.state.createdAt).fromNow();

    var completedTime = moment(task.completed_at).fromNow();

    if (task.completed) {
      return (
        <div className="created-by">Created by {this.state.createdByState} {verboseTime} and completed {completedTime}</div>
      )
    } else {
      return(
        <div className="created-by">Created by {this.state.createdByState} {verboseTime}</div>
      )
    }
  },
  onDotDragStart: function(){
    var settings = MainStore.get('settings');
    var taskId = task.id;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + taskId;
    swipes.dot.startDrag(this.shareData(taskUrl));
  },
  renderHeader: function(task) {
    var settings = MainStore.get('settings');
    var taskId = task.id;
    var allUsers = UserStore.getAll();
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + taskId;
    var dotItems = this.dotItems(task);
    var headerCompletedState = '';
    var name;
    var keepName;
    if (task.completed) {
      headerCompletedState = 'completed'
    } else {

    }
    var time = moment(this.state.createdAt).format("h:mm a, d MMM YYYY");
    var verboseTime = moment(this.state.createdAt).fromNow();
    
    if (task.assignee) {
      if (allUsers[task.assignee.id] && allUsers[task.assignee.id].name) {
        keepName = allUsers[task.assignee.id].name;
        name = allUsers[task.assignee.id].name;
      } else {
        name = keepName;
      }
    } else {
      name = 'Assign'
    }


    return (
      <div id={taskId} className={"header-wrapper " + headerCompletedState}>
        <div className="back-arrow" onClick={this.goBack}>
          <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
        </div>
        <div className="header-dot-wrapper">
          <SwipesDot
            className="dot"
            hoverParentId={taskId}
            elements={dotItems}
            onDragStart={this.onDotDragStart}
          />
        </div>
        <div className="header-details">
          {this.renderTitle(task)}
          {this.renderExtraData(task)}
          {this.renderDescription(task)}
          <div className="data-wrapper">
            <div className="header-avatar">
                <AssigneeMenu task={task} />
                {name}
            </div>
            {this.renderDueOnDate(task)}
          </div>
        </div>
      </div>
    )
  },
  renderTabs: function (task) {
    var that = this;
    var labels = ['Subtasks', 'Comments'];
    var tabs = labels.map(function (label, index) {
    var children;
    var commentsAmount = that.state.comments.length + that.state.attachments.length;

      if (label === 'Subtasks') {
        children = <Subtasks task={task} />;
          return <Tab
            style={tabsStyles.singleTab}
            className="asana-tab"
            label={label}
            key={index}
            onActive={that.onActiveTab}
          >
    				{children}
    			</Tab>
      } else {
        children = <Comments task={task} />;
        label = 'Comments (' + commentsAmount + ')';
          return <Tab
            style={tabsStyles.singleTab}
            className="asana-tab"
            label={label}
            key={index}
            onActive={that.onActiveTab} >
    				{children}
    			</Tab>
      }
    })

    return <Tabs className="height-100 tabs-child-selector"
      contentContainerClassName="tabs-wrapper"
			tabItemContainerStyle={{background:'#F4F4F5'}}
			inkBarStyle={tabsStyles.inkBarStyle}
			children={tabs}>
    </Tabs>
  },
  render: function () {
    var loaded = TasksStore.get('loaded');
    var tasks = TasksStore.get('tasks');
    var taskId = this.props.taskId;
    var settings = MainStore.get('settings');
    var task = tasks.filter(function (task) {
      return task.id === taskId;
    })[0];

    if (loaded && task) {
      return (
        <div>
          {this.renderHeader(task)}
          {this.renderTabs(task)}
        </div>
      )
    } else {
      return (
        <div className="height-100">
          <Loading />
        </div>
      )
    }
  }
});

module.exports = ExpandedTask;
