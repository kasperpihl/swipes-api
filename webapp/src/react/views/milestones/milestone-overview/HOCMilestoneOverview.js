import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { propsOrPop } from 'swipes-core-js/classes/react-utils';
import { setupLoading, bindAll } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import TabMenu from 'context-menus/tab-menu/TabMenu';
// import { map, list } from 'react-immutable-proptypes';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import { List, fromJS } from 'immutable';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import MilestoneOverview from './MilestoneOverview';

class HOCMilestoneOverview extends PureComponent {
  static sizes() {
    return [750, 1100];
  }
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
      order: fromJS({
        now: props.milestone.get('goal_order'),
        later: [],
        completed: [],
      }),
    };
    propsOrPop(this, 'milestone');
    bindAll(this, ['onDragStart', 'onDragEnd']);
    setupLoading(this);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onScroll(e) {
    const { showLine } = this.state;
    let newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine })
    }
  }
  getNewGoalOrder(oldIndex, newIndex) {
  }
  onStepSort({collection, oldIndex, newIndex}) {
    if(oldIndex === newIndex){
      return;
    }

    const { reorderGoals, milestone, groupedGoals } = this.props;
    const currentGoalOrder = milestone.get('goal_order');
    let tempOrder = groupedGoals.get(collection).map(g => g.get('id'));
    const movedId = tempOrder.get(oldIndex);
    const tempGoalOrder = tempOrder.delete(oldIndex).insert(newIndex, movedId);

    oldIndex = currentGoalOrder.findIndex((gId) => gId === groupedGoals.getIn([collection, oldIndex, 'id']));
    newIndex = currentGoalOrder.findIndex((gId) => gId === groupedGoals.getIn([collection, newIndex, 'id']));
    const newGoalOrder = milestone.get('goal_order').delete(oldIndex).insert(newIndex, movedId);

    this.setLoading(movedId, 'Reordering...');
    this.setState({ tempOrder: tempGoalOrder });

    reorderGoals(milestone.get('id'), newGoalOrder).then((res) => {
      if(!this._unmounted) {
        console.log('ressy', res);
        this.setState({tempOrder: null});
        this.clearLoading(movedId);
      }
      
    });

  }
  onTitleClick(e) {
    const options = this.getOptionsForE(e);
    options.positionY = 0;
    options.excludeY = false;
    options.alignX = 'left';
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
  onDragStart() {
    document.body.classList.add("no-select");
  }
  onDragEnd(result) {
    document.body.classList.remove("no-select");
    console.log('onDragEnd', result);
    if (!result.destination) {
      return;
    }

    let { order } = this.state;

    const { droppableId: source, index: sourceI } = result.source;
    const { droppableId: dest, index: destI } = result.destination;
    const res = order.getIn([source, sourceI]);
    order = order.deleteIn([source, sourceI]);
    order = order.updateIn([dest], (arr) => arr.insert(destI, res));

    this.setState({ order });
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
  onDelete(options) {
    const { milestone, confirm, deleteMilestone } = this.props;
    confirm(Object.assign({}, options, {
      title: 'Delete plan',
      message: 'This will delete this plan and all goals in it. Are you sure?',
    }), (i) => {
      if (i === 1) {
        this.setLoading('dots');
        deleteMilestone(milestone.get('id')).then((res) => {
          if(res.ok){
            window.analytics.sendEvent('Plan deleted', {});
          }
          if (!res || !res.ok) {
            this.clearLoading('dots', '!Something went wrong');
          }
        });
      }
    });
  }
  onInfoTabAction(i, options) {
    if(i === 1) {
      return this.onDelete(options);
    }
    const {
      closeMilestone,
      openMilestone,
      confirm,
      milestone,
    } = this.props;

    if (milestone.get('closed_at')) {
      this.setLoading('dots');
      openMilestone(milestone.get('id')).then((res) => {
        if (res.ok) {
          this.clearLoading('dots', 'Moved to current', 2000);
          window.analytics.sendEvent('Plan opened', {});
        } else {
          this.clearLoading('dots', '!Something went wrong', 3000);
        }
      });
      return;
    }
    confirm(Object.assign({}, options, {
      title: 'Mark plan as achieved',
      message: 'Incompleted goals will be moved to goals without milestone.',
    }), (i) => {
      if (i === 1) {
        this.setLoading('dots');
        closeMilestone(milestone.get('id')).then((res) => {
          if (res.ok) {
            this.clearLoading('dots', 'Moved to achieved', 2000);
            window.analytics.sendEvent('Plan closed', {});
          } else {
            this.clearLoading('dots', '!Something went wrong', 3000);
          }
        });
      }
    });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 10,
    };
  }
  getInfoTabProps() {
    const { milestone } = this.props;
    let achieveLbl = 'Mark plan as achieved';
    let achieveIcon = 'MilestoneAchieve';
    let complete = true;
    if (milestone.get('closed_at')) {
      complete = false,
      achieveIcon = 'Milestone';
      achieveLbl = 'Move plan to current';
    }
    const createdLbl = `${dayStringForDate(milestone.get('created_at'))} by ${msgGen.users.getFullName(milestone.get('created_by'))}`
    return {
      actions: [
        { title: achieveLbl, complete, icon: achieveIcon },
        { title: 'Delete plan', icon: 'Delete', danger: true },
      ],
      info: [
        { title: 'Created', text: createdLbl },
      ],
      about: {
        title: 'What is a plan',
        text: 'A Plan is where everything begins. It is a project, objective or ongoing activity. You can add goals to reach a Plan.\n\nTo keep your work organized, categorize goals for your Plan with This week, Later or Completed.'
      },
    }
  }
  render() {
    const { milestone, groupedGoals, viewWidth } = this.props;
    const { showLine, tempOrder, order } = this.state;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <MilestoneOverview
          order={order}
          {...this.bindLoading()}
          tempOrder={tempOrder}
          milestone={milestone}
          groupedGoals={groupedGoals}
          delegate={this}
          showLine={showLine}
          viewWidth={viewWidth}
        />
      </DragDropContext>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goals: state.get('goals'),
    groupedGoals: cs.milestones.getGroupedGoals(state, ownProps),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
  };
}

export default navWrapper(connect(mapStateToProps, {
  contextMenu: a.main.contextMenu,
  inputMenu: a.menus.input,
  closeMilestone: ca.milestones.close,
  openMilestone: ca.milestones.open,
  reorderGoals: ca.milestones.reorderGoals,
  deleteMilestone: ca.milestones.deleteMilestone,
  renameMilestone: ca.milestones.rename,
  confirm: a.menus.confirm,
})(HOCMilestoneOverview));
