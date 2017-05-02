import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';

class GoalItemTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="goal-item-tooltip" key={this.props.goalId}>{this.props.tooltipText}</div>
    );
  }
}

export default GoalItemTooltip;

// const { string } = PropTypes;

GoalItemTooltip.propTypes = {};
