import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HOCAssigning from 'components/assigning/HOCAssigning';

import GoalsUtil from 'classes/goals-util';

import './styles/goal-list-item.scss';

class GoalListItem extends Component {
  constructor(props) {
    super(props);
    const { data, me } = props;
    this.helper = new GoalsUtil(data, me.get('id'));
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  clickedListItem() {
    const { onClick, data } = this.props;

    if (onClick) {
      onClick(data.get('id'));
    }
  }
  render() {
    const { data } = this.props;
    const rootClass = 'goal-list-item';
    const status = this.helper.getStatusForCurrentStep();

    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{data.get('title')}</div>
          <div className={`${rootClass}__label`}>{status}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <HOCAssigning
            stepIndex={data.get('currentStepIndex')}
            goalId={data.get('id')}
          />
        </div>
      </div>
    );
  }
}

const { func } = PropTypes;

GoalListItem.propTypes = {
  data: map,
  me: map,
  onClick: func,
};

export default GoalListItem;
