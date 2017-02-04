import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/goal-list-item.scss';

class GoalListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  clickedListItem() {
    const { onClick, goal } = this.props;

    if (onClick) {
      onClick(goal.get('id'));
    }
  }
  render() {
    const { goal, filter } = this.props;
    const rootClass = 'goal-list-item';
    const status = msgGen.getGoalSubtitle(goal, filter);

    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{goal.get('title')}</div>
          <div className={`${rootClass}__label`}>{status}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <HOCAssigning
            stepId={goal.getIn(['status', 'current_step_id'])}
            goalId={goal.get('id')}
            maxImages={1}
          />
        </div>
      </div>
    );
  }
}

const { func } = PropTypes;

GoalListItem.propTypes = {
  goal: map,
  filter: map,
  onClick: func,
};

export default GoalListItem;
