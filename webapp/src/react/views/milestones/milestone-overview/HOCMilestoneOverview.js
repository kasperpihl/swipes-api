import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { propsOrPop } from 'classes/react-utils';
import { setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCGoalSelector from 'context-menus/goal-selector/HOCGoalSelector';
import TabMenu from 'context-menus/tab-menu/TabMenu';
// import { map, list } from 'react-immutable-proptypes';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import { List } from 'immutable';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import MilestoneOverview from './MilestoneOverview';

class HOCMilestoneOverview extends PureComponent {
  static minWidth() {
    return 840;
  }
  static maxWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    propsOrPop(this, 'milestone');
    setupLoading(this);
  }
  componentWillMount() {
    this.setState({
      tabIndex: 0,
      tabs: ['Current', 'Completed'],
      goals: this.getFilteredGoals(this.props.milestone, this.props.starredGoals),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.milestone, nextProps.starredGoals),
    });
  }
  onContext(e) {
    const {
      closeMilestone,
      openMilestone,
      contextMenu,
      confirm,
      milestone,
    } = this.props;
    const options = this.getOptionsForE(e);
    const delegate = {
      onItemAction: (item, i) => {
        if (item.id === 'open') {
          contextMenu(null);
          this.setLoading('dots');
          openMilestone(milestone.get('id')).then((res) => {
            if (res.ok) {
              this.clearLoading('dots', 'Opened', 2000);
              window.analytics.sendEvent('Milestone opened', {});
            } else {
              this.clearLoading('dots', '!Something went wrong', 3000);
            }
          });
          return;
        }
        confirm(Object.assign({}, options, {
          title: 'Close milestone',
          message: 'Incompleted goals will be unassigned from this milestone.',
        }), (i) => {
          if (i === 1) {
            this.setLoading('dots');
            closeMilestone(milestone.get('id')).then((res) => {
              if (res.ok) {
                this.clearLoading('dots', 'Closed', 2000);
                window.analytics.sendEvent('Milestone closed', {});
              } else {
                this.clearLoading('dots', '!Something went wrong', 3000);
              }
            });
          }
        });
      },
    };
    const items = [{ id: 'close', title: 'Close milestone' }];
    if (milestone.get('closed_at')) {
      items[0] = { id: 'open', title: 'Open milestone' };
    }
    contextMenu({
      options,
      component: TabMenu,
      props: {
        items,
        delegate,
      },
    });
  }
  onDiscuss(e) {
    const { navPush, milestone } = this.props;
    navPush({
      id: 'CreatePost',
      title: 'Create Post',
      props: {
        context: {
          title: milestone.get('title'),
          id: milestone.get('id'),
        },
      },
    });
  }
  onTitleClick(e) {
    const options = this.getOptionsForE(e);
    const { milestone, renameMilestone, inputMenu } = this.props;
    inputMenu({
      ...options,
      text: milestone.get('title'),
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== milestone.get('title') && title.length) {
        this.setLoading('title', 'Renaming...');
        renameMilestone(milestone.get('id'), title).then(() => {
          this.clearLoading('title');
        });
      }
    });
  }
  onClose() {

  }
  onAddGoalToMilestone(goalId) {
    const { goals, milestone, addGoalToMilestone } = this.props;
    const goal = goals.get(goalId);
    if (goal.get('milestone_id') !== milestone.get('id')) {
      const isCompleted = new GoalsUtil(goal).getIsCompleted();
      this.tabDidChange(isCompleted ? 1 : 0);
      this.setLoading('add');
      addGoalToMilestone(milestone.get('id'), goalId).then((res) => {
        if (res && res.ok) {
          this.clearLoading('add');
        } else {
          this.clearLoading('add', '!Something went wrong', 3000);
        }
      });
    }
  }
  onCreateGoal(title) {
    const { milestone, createGoal } = this.props;
    this.setLoading('add');
    this.tabDidChange(0);
    createGoal(title, milestone.get('id')).then((res) => {
      if (res && res.ok) {
        this.clearLoading('add');
        window.analytics.sendEvent('Goal added', {});
      } else {
        this.clearLoading('add', '!Something went wrong', 3000);
      }
    });
  }
  onAddGoals(e) {
    const { contextMenu, milestone } = this.props;
    const options = this.getOptionsForE(e);
    contextMenu({
      component: HOCGoalSelector,
      options,
      props: {
        milestoneId: milestone.get('id'),
        delegate: this,
      },
    });
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;
    window.analytics.sendEvent('Goal opened', {});
    navPush({
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId,
      },
    });
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  getFilteredGoals(milestone, starredGoals) {
    const goals = msgGen.milestones.getGoals(milestone);
    let gg = goals.sort((g1, g2) => {
      const g1StarI = starredGoals.indexOf(g1.get('id'));
      const g2StarI = starredGoals.indexOf(g2.get('id'));
      if (g1StarI > g2StarI) {
        return -1;
      }
      if (g2StarI > g1StarI) {
        return 1;
      }
      return 0;
    }).groupBy(g => new GoalsUtil(g).getIsCompleted() ? 'Completed' : 'Current');

    // Make sure there if no current or completed to add an empty list
    gg = gg.set('Current', gg.get('Current') || List());
    gg = gg.set('Completed', gg.get('Completed') || List());
    return gg;
  }
  getGoalListProps() {
    const { tabIndex, tabs } = this.state;
    return {
      delegate: this,
      tabIndex,
      tabs,
    };
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 10,
    };
  }
  render() {
    const { milestone } = this.props;
    const { goals, tabs, tabIndex } = this.state;

    return (
      <MilestoneOverview
        {...this.bindLoading()}
        milestone={milestone}
        tabs={tabs}
        goals={goals}
        tabIndex={tabIndex}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneOverview.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    goals: state.get('goals'),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
  };
}

export default navWrapper(connect(mapStateToProps, {
  contextMenu: a.main.contextMenu,
  inputMenu: a.menus.input,
  closeMilestone: ca.milestones.close,
  openMilestone: ca.milestones.open,
  renameMilestone: ca.milestones.rename,
  confirm: a.menus.confirm,
  addGoalToMilestone: ca.milestones.addGoal,
  createGoal: ca.goals.create,
})(HOCMilestoneOverview));
