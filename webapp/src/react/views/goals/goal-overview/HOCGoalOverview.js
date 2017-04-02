import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { bindAll, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';

import TabMenu from 'context-menus/tab-menu/TabMenu';
import GoalOverview from './GoalOverview';

/* global msgGen */

class HOCGoalOverview extends PureComponent {
  static minWidth() {
    return 840;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    bindAll(this, ['onContext']);
    this.state = {
      tabIndex: 0,
      editMode: false,
    };
    setupLoading(this);

    this.clearCB = setupCachedCallback(this.clearLoadingForStep, this);
  }
  componentDidMount() {
    const { goal, navPop } = this.props;
    if (!goal) {
      navPop();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }
  onEditSteps() {
    this.setState({ editMode: !this.state.editMode });
  }
  onClickAttachment(hI, i) {
    const { goal, preview, target } = this.props;
    const helper = this.getHelper();
    const lastActivty = helper.getLastActivity();
    const flag = lastActivty.getIn(['flags', i]);
    const att = goal.getIn(['attachments', flag]);
    const selection = window.getSelection();

    if (att && selection.toString().length === 0) {
      preview(target, att);
    }
  }
  onTitleClick(e) {
    const options = this.getOptionsForE(e);
    const { goal, renameGoal, inputMenu } = this.props;
    inputMenu({
      ...options,
      text: goal.get('title'),
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== goal.get('title') && title.length) {
        this.setLoading('title', 'Renaming...');
        renameGoal(goal.get('id'), title).then(() => {
          this.clearLoading('title');
        });
      }
    });
  }

  onHandoffMessage(handoff) {
    const helper = this.getHelper();
    let assignees = helper.getAllInvolvedAssignees();
    if (handoff.toId) {
      assignees = helper.getAssigneesForStepId(handoff.toId);
    }
    // console.log(i, handoff);
    this.onOpenNotify(undefined, assignees);
  }

  onOpenNotify(notify) {
    const { openSecondary, goal } = this.props;
    openSecondary({
      id: 'Notify',
      title: 'Notify',
      props: {
        notify,
        goalId: goal.get('id'),
      },
    });
  }
  onChooseNotificationType(e, request) {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);
    options.alignY = 'top';
    options.alignX = 'center';
    options.positionY = 6;
    options.excludeY = true;
    const subtitles = [
      request ? 'Ask your teammates for an update' : 'Give your teammates an update',
      request ? 'Ask your teammates for a comment' : 'Share your feedback on this goal',
      request ? 'Ask your teammates for additional information' : 'Notify your teammates about new information',
      request ? 'Ask your teammates to make a choice' : 'Let your teammates know about a decisions',
    ];
    const items = [
      { title: 'Status', icon: 'Status', subtitle: subtitles[0] },
      { title: 'Feedback', icon: 'Feedback', subtitle: subtitles[1] },
      { title: 'Assets', icon: 'Assets', subtitle: subtitles[2] },
      { title: 'Decision', icon: 'Decision', subtitle: subtitles[3] },
    ].map((i) => { i.leftIcon = { icon: i.icon }; return i; });

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        this.onOpenNotify(fromJS({
          request,
          notification_type: item.title.toLowerCase(),
        }));
      },
    };
    const loadingId = request ? 'ask-for-menu' : 'notify-menu';
    this.setLoading(loadingId);
    contextMenu({
      options,
      component: TabMenu,
      onClose: () => this.clearLoading(loadingId),
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  }
  onAskFor(e) {
    this.onChooseNotificationType(e, true);
  }
  onNotify(e) {
    this.onChooseNotificationType(e, false);
  }
  onBarClick(e) {
    const helper = this.getHelper();
    this.onStepCheck(helper.getCurrentStepIndex(), e);
  }
  onContext(e) {
    const {
      goal,
      archive,
      contextMenu,
      confirm,
    } = this.props;
    const options = this.getOptionsForE(e);
    const delegate = {
      onItemAction: () => {
        confirm(Object.assign({}, options, {
          title: 'Archive goal',
          message: 'This will make this goal inactive for all participants.',
        }), (i) => {
          if (i === 1) {
            this.setLoading('dots');
            archive(goal.get('id')).then((res) => {
              if (!res || !res.ok) {
                this.clearLoading('dots', '!Something went wrong');
              }
            });
          }
        });
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        items: [{ title: 'Archive Goal' }],
        delegate,
      },
    });
  }
  getOptionsForE(e) {
    if (e && e.boundingRect) {
      return e;
    }
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }
  render() {
    const { goal, me } = this.props;
    const { tabIndex, editMode } = this.state;

    return (
      <GoalOverview
        goal={goal}
        editMode={editMode}
        myId={me.get('id')}
        tabIndex={tabIndex}
        delegate={this}
        loadingState={this.getAllLoading()}
      />
    );
  }
}

const { func } = PropTypes;

HOCGoalOverview.propTypes = {
  goal: map,
  confirm: func,
  me: map,
  navPop: func,
  inputMenu: func,
  archive: func,
  openSecondary: func,
  renameGoal: func,
  contextMenu: func,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  archive: ca.goals.archive,
  contextMenu: a.main.contextMenu,
  renameGoal: ca.goals.rename,
  selectAssignees: a.goals.selectAssignees,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
  preview: a.links.preview,
})(HOCGoalOverview);
