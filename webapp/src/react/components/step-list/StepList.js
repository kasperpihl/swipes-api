import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

import './styles/step-list.scss';

class StepList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderSteps() {
    const { steps, completed } = this.props;

    const renderSteps = steps.map((s, i) => {
      let className = 'step-list__item';

      if (i <= completed) {
        className += ' step-list__item--completed';
      } else if (i === completed + 1) {
        className += ' step-list__item--current';
      } else {
        className += ' step-list__item--future';
      }
      return (
        <div className={className}>{s.get('title')}</div>
      );
    });

    return renderSteps;
  }
  render() {
    return (
      <div className="step-list">
        {this.renderSteps()}
      </div>
    );
  }
}

export default StepList;

const { number } = PropTypes;

StepList.propTypes = {
  steps: map,
  completed: number,
};
