import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HOCAssigning from 'components/assigning/HOCAssigning';

import GoalsUtil from 'classes/goals-util';

import './styles/goal-list-item.scss';

class GoalListItem extends Component {
  constructor(props) {
    super(props);
    const { goal, me } = props;
    this.helper = new GoalsUtil(goal, me.get('id'));
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
    const { goal } = this.props;
    const rootClass = 'goal-list-item';
    const status = this.helper.getStatus();

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
  me: map,
  onClick: func,
};

export default GoalListItem;
