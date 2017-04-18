import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { fromJS, List, Map } from 'immutable';
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
      handoff: null,
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
  onSeeAll() {
    const { openSecondary, goal } = this.props;
    openSecondary({
      id: 'ActivityFeed',
      title: 'ActivityFeed',
      props: {
        goalId: goal.get('id'),
      },
    });
  }
  onReply(i) {
    const helper = this.getHelper();
    const lastActivity = helper.getLastActivity();
    const lastActivityIndex = helper.getLastActivityIndex();
    const { navPush } = this.props;
    navPush({
      id: 'Notify',
      title: 'Notify',
      props: {
        notify: Map({
          reply_to: lastActivityIndex,
          notification_type: lastActivity.get('notification_type'),
          assignees: List([lastActivity.get('done_by')]),
        }),
        goalId: helper.getId(),
      },
    });
  }
  onClickAttachment(hI, i) {
    const { goal, preview, target } = this.props;
    const helper = this.getHelper();
    const lastActivity = helper.getLastActivity();
    const flag = lastActivity.getIn(['flags', i]);
    const att = goal.getIn(['attachments', flag]);
    const selection = window.getSelection();

    if (att && selection.toString().length === 0) {
      window.analytics.sendEvent('Flag opened', {
        From: 'Latest Update',
        Type: att.getIn([id, 'link', 'service', 'type']),
        Service: att.getIn([id, 'link', 'service', 'name']),
      });
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
    const getSub = msgGen.notify.getNotifyPopupSubtitle.bind(null, request);

    const items = [
      { title: 'Update', icon: 'Status', subtitle: getSub('update') },
      { title: 'Feedback', icon: 'Feedback', subtitle: getSub('feedback') },
      { title: 'Assets', icon: 'Assets', subtitle: getSub('assets') },
      { title: 'Decision', icon: 'Decision', subtitle: getSub('decision') },
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
  onStepWillComplete() {
    this.setLoading('completing');
  }
  onStepDidFailComplete() {
    this.clearLoading('completing');
  }
  onStepDidComplete(handoff) {
    this.clearLoading('completing');
    this.setState({ handoff });
  }
  onBarClick(e) {
    const helper = this.getHelper();
    if (this.stepList) {
      this.stepList.onStepCheck(helper.getCurrentStepIndex(), e);
    }
  }
  onCloseHandoff() {
    this.setState({ handoff: null });
  }
  onHandoff() {
    const { handoff } = this.state;
    const { me } = this.props;

    if (handoff) {
      const helper = this.getHelper();
      let assignees = helper.getAllInvolvedAssignees();
      if (handoff.toId) {
        assignees = helper.getAssigneesForStepId(handoff.toId);
      }
      this.onOpenNotify(fromJS({
        notification_type: 'update',
        assignees: assignees || [me.get('id')],
      }));
      this.setState({ handoff: null });
    }
  }
  onAskFor(e) {
    this.onChooseNotificationType(e, true);
  }
  onNotify(e) {
    this.onChooseNotificationType(e, false);
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
              if(res.ok){
                window.analytics.sendEvent('Goal archived', {});
              }
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
  viewDidLoad(stepList) {
    this.stepList = stepList;
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
    const { tabIndex, editMode, handoff } = this.state;

    return (
      <GoalOverview
        goal={goal}
        editMode={editMode}
        handoff={handoff}
        myId={me.get('id')}
        tabIndex={tabIndex}
        delegate={this}
        {...this.bindLoading()}
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
