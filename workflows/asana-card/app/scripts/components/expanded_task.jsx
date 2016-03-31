var React = require('react');
var Reflux = require('reflux');
var FontIcon = require('material-ui/lib/font-icon');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var Loading = require('./loading');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');
var TasksStore = require('../stores/TasksStore');
var TaskStore = require('../stores/TaskStore');
var TaskActions = require('../actions/TaskActions');
var ProjectDataActions = require('../actions/ProjectDataActions');
var AssigneeMenu = require('./assignee_menu');
var Subtasks = require('./subtasks');
var SwipesDot = require('swipes-dot').default;
var Comments = require('./comments');

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
		height: '40px',
		marginTop: '-40px',
		position: 'relative',
		zIndex: '1',
		backgroundColor: '#F4F4F5'
	}
};

var ExpandedTask = React.createClass({
  mixins: [TasksStore.connect(), TaskStore.connect()],
  componentDidMount: function() {
    var taskId = this.props.taskId;

    var storyPromise = swipes.service('asana').request('stories.findByTask', {
      id: taskId
    }).then(function(story) {
      TaskActions.addAuthor(story.data[0].created_by.name);
    })


  },
  goBack: function () {
    MainActions.closeExpandedTask();
  },
  shareTaskUrl: function (taskUrl) {
    swipes.share.request({url: taskUrl});
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
  dotItems: function (task) {
    var that = this;
    var items = [];
    //var task = this.props.task;
    var settings = MainStore.get('settings');
    var taskId = this.props.taskId;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + task.id;

    if (task.completed) {
      items.push({
        label: 'Undo',
        icon: 'undo',
        callback: function () {
          that.undoCompleteTask(task);
        }
      })
    } else {
      items.push({
        label: 'Complete',
        icon: 'check',
        callback: function () {
          that.completeTask(task);
        }
      })
    }

    items = items.concat([
      {
        label: 'Remove',
        icon: 'delete',
        callback: function () {
          that.removeTask(task);
        }
      },
      {
        label: 'Share the task',
        icon: 'share',
        callback: function () {
          that.shareTaskUrl(taskUrl);
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
  saveDescripton: function() {
    var newDescription = this.refs.desci.value;
    var taskId = this.props.taskId;

    this.setState({descEditingState: 'inactive'});

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      notes: newDescription
    })
    // TODO handle errors
  },
  saveTitle: function() {
    var newTitle = this.refs.headerTitle.value;
    var taskId = this.props.taskId;

    this.setState({titleEditingState: 'inactive'});

    swipes.service('asana').request('tasks.update', {
      id: taskId,
      name: newTitle
    })
    // TODO handle errors
  },
  onTitleChange: function(event){
    this.setState({'titleInputValue': event.target.value});
  },
  onDescriptionChange: function(event){
    this.setState({'descriptionInputValue': event.target.value});
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
  onTitleKeyUp: function(e){

  },
  renderExpander: function(description) {

    if (description && description.length > 0 && description.length > 140) {
      return (
        <div className="expand-description" onClick={this.expandDescription}>
          <FontIcon className="material-icons">{this.state.expandedState}</FontIcon>
        </div>
      )
    } else {
    }
  },
  expandDescription: function () {
    TaskActions.expandDesc(!this.state.expandDesc);
    if (!this.state.expandDesc) {
      this.setState({expandedState: 'keyboard_arrow_up'})
    } else {
      this.setState({expandedState: 'keyboard_arrow_down'})
    }
  },
  expandDescriptionOnFocus: function() {
    TaskActions.expandDesc(true);
    this.setState({expandedState: 'keyboard_arrow_up'});
  },
  onActiveTab: function (tab) {
    var label = tab.props.label;

    if (label === 'Comments') {
      MainActions.commentsView(true);
    } else {
      MainActions.commentsView(false);
    }
  },
  renderTitle: function(task){
    /*<div className="header-title" ref="headerTitle" contentEditable="true" onBlur={this.saveTitle}>{task.name}</div>*/
    return (
      <Textarea
        ref="headerTitle"
        className="header-title"
        defaultValue={task.name}
        onKeyUp={this.onTitleKeyUp}
        onKeyDown={this.onTitleKeyDown}
        onChange={this.onTitleChange}
        onBlur={this.saveTitle}
        placeholder="Add title"
        value={this.state.titleInputValue}
        minRows={1}
        maxRows={10}/>
    );
  },
  renderDescription: function (task) {
    var description = task.notes;
    var value = this.state.descriptionInputValue;
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
          defaultValue={description}
          onFocus={this.expandDescriptionOnFocus}
          onChange={this.onDescriptionChange}
          onBlur={this.saveDescripton}
          onKeyDown={this.onDescriptionKeyDown}
          placeholder="No description"
          value={value}
          minRows={1}
          maxRows={maxRows}/>
        {this.renderExpander(description)}
      </div>
    );
  },
  renderHeader: function(task) {
    var settings = MainStore.get('settings');
    var taskId = task.id;
    var taskUrl = 'https://app.asana.com/0/' + settings.projectId + '/' + taskId;
    var dotItems = this.dotItems(task);
    var headerCompletedState = '';
    if (task.completed) {
      headerCompletedState = 'completed'
    } else {

    }
    return (
      <div id={taskId} className={"header-wrapper " + headerCompletedState}>
        <div className="back-arrow" onClick={this.goBack}>
          <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
        </div>
        <div className="header-details">
          {this.renderTitle(task)}
          {this.renderDescription(task)}
          {this.state.createdByState}
        </div>
        <div className="header-avatar">
            <AssigneeMenu task={task} />
        </div>

        <div className="header-dot-wrapper">
          <SwipesDot
            reverse="true"
            className="dot"
            hoverParentId={taskId}
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
        </div>
      </div>
    )
  },
  renderTabs: function (task) {
    var that = this;
    var labels = ['Subtasks', 'Comments'];

    var tabs = labels.map(function (label, index) {
      var children;

      if (label === 'Subtasks') {
        children = <Subtasks task={task} />;
      } else {
        children = <Comments task={task} />;
      }

      return <Tab
        style={tabsStyles.singleTab}
        className="asana-tab"
        label={label}
        key={index}
        onActive={that.onActiveTab}
      >
				{children}
			</Tab>
    })
    return <Tabs className="height-100 tabs-child-selector"
      contentContainerClassName="tabs-wrapper"
			tabItemContainerStyle={{background:'none'}}
			inkBarStyle={tabsStyles.inkBarStyle}
			children={tabs}>
    </Tabs>
  },
  render: function () {
    var tasks = TasksStore.get('tasks');
    var taskId = this.props.taskId;
    var settings = MainStore.get('settings');
    var task = tasks.filter(function (task) {
      return task.id === taskId;
    })[0];
    return (
      <div>
        {this.renderHeader(task)}
        {this.renderTabs(task)}
      </div>
    )
  }
});

module.exports = ExpandedTask;
