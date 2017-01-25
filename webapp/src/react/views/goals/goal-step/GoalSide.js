import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

class GoalSide extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderProgress() {

  }
  renderStepList() {

  }

  render() {
    return (
      <div className="goal-side">
        {this.renderProgress()}
        {this.renderStepList()}
      </div>
    );
  }
}

export default GoalSide;

GoalSide.propTypes = {
  goal: map,
};
