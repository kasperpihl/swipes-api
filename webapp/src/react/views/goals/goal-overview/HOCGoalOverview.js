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
    bindAll(this, ['onHandoff', 'onContext']);
    this.state = { tabIndex: 0 };
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
  onAskFor(e) {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);
    options.alignY = 'top';
    options.positionY = 6;
    options.excludeY = true;
    const items = ['Feedback', 'Assets', 'Decision', 'Status'].map(title => ({ title, leftIcon: { icon: 'Checkmark' } }));

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        this.onOpenNotify(fromJS({
          request: true,
          notification_type: item.title.toLowerCase(),
        }));
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '210px',
        },
      },
    });
  }
  onNotify() {
    this.onOpenNotify();
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
      createWay,
      confirm,
      inputMenu,
    } = this.props;
    const options = this.getOptionsForE(e);
    const delegate = {
      onItemAction: (item) => {
        if (item.title === 'Complete goal') {
          const helper = this.getHelper();
          const totalSteps = helper.getTotalNumberOfSteps();
          this.onStepCheck(totalSteps, options);
          contextMenu(null);
        } else if (item.id === 'way') {
          inputMenu(Object.assign({}, options, {
            initialValue: goal.get('title'),
            placeholder: 'Name your Way: Like Development, Design etc.',
            buttonLabel: 'Save',
          }), (title) => {
            this.setLoading('dots');
            const helper = this.getHelper();
            createWay(title, helper.getObjectForWay()).then((res) => {
              if (res && res.ok) {
                this.clearLoading('dots', 'Added way');
              } else {
                this.clearLoading('dots', '!Something went wrong');
              }
            });
          });
        } else {
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
        }
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        items: [
          { title: 'Complete goal' },
          // { id: 'way', title: 'Save as a Way' },
          { title: 'Archive Goal' },
        ],
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
    const { tabIndex } = this.state;

    return (
      <GoalOverview
        goal={goal}
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
  createWay: func,
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
  createWay: ca.ways.create,
  archive: ca.goals.archive,
  contextMenu: a.main.contextMenu,
  renameGoal: ca.goals.rename,
  selectAssignees: a.goals.selectAssignees,
  confirm: a.menus.confirm,
  inputMenu: a.menus.input,
})(HOCGoalOverview);
