import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { propsOrPop } from 'classes/react-utils';
import { setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
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
  onClose() {

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
    let achieveLbl = 'Mark milestone as achieved';
    if (milestone.get('closed_at')) {
      achieveLbl = 'Move milestone to current';
    }
    return {
      actions: [
        { title: 'Delete milestone' },
        { title: 'Mark milestone as achieved' },
      ],
      info: [
        { title: 'Created', text: '19 apr etc PLACEHOLDER' },
      ],
      about: {
        title: 'What is a milestone?',
        text: 'A Milestone is where everything begins. It is a project, objective or ongoing activity. You can add goals to reach a Milestone.\n\nTo keep your work organized, categorize goals for your Milestone with This week, Later or Completed.'
      },
    }
  }
  render() {
    const { milestone, groupedGoals } = this.props;

    return (
      <MilestoneOverview
        {...this.bindLoading()}
        milestone={milestone}
        groupedGoals={groupedGoals}
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
    groupedGoals: cs.milestones.getGroupedGoals(state, ownProps),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
  };
}

export default navWrapper(connect(mapStateToProps, {
  contextMenu: a.main.contextMenu,
  inputMenu: a.menus.input,
  closeMilestone: ca.milestones.close,
  openMilestone: ca.milestones.open,
  renameMilestone: ca.milestones.rename,
  confirm: a.menus.confirm,
})(HOCMilestoneOverview));
