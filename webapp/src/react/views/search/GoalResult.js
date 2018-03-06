import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';
import './styles/goal-result.scss';

class GoalResult extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLinkClick')
  }
  renderAssignees() {
    const { result } = this.props;
    const assignees = msgGen.goals.getAssignees(result.item.id);

    return (
      <div className="goal-result__assignees">
        <HOCAssigning assignees={assignees} rounded size={30} />
      </div>
    )
  }
  render() {
    const { result } = this.props;
    let className = 'goal-result';

    if (result.item.completed_at) {
      className += ' goal-result--completed';
    }

    return (
      <div className={className}>
        <div className="goal-result__circle">
          <Icon icon="ChecklistCheckmark" className="goal-result__svg" />
        </div>
        <div className="goal-result__title">{result.item.title}</div>
        {this.renderAssignees()}
      </div>
    )
  }
}

export default GoalResult
// const { string } = PropTypes;
GoalResult.propTypes = {};
