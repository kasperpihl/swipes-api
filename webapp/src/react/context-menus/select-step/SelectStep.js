import React, { PureComponent, PropTypes } from 'react';
import { listOf, mapContains } from 'react-immutable-proptypes';
import HOCStepList from 'components/step-list/HOCStepList';

import './styles/select-step.scss';

class SelectStep extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  onClick(i) {
    const { onClick } = this.props;
    if (onClick) {
      onClick(i);
    }
  }
  onStepCheck(i) {
    this.onClick(i);
  }
  onStepClick(i) {
    this.onClick(i);
  }
  clickedAssign(i) {
    this.onClick(i);
  }
  renderSteps() {
    const { numberOfCompleted, steps } = this.props;
    return (
      <HOCStepList
        delegate={this}
        steps={steps}
        completed={numberOfCompleted}
        fullHover
      />
    );
  }
  render() {
    return (
      <div className="step-selection-menu">
        <div className="step-selection-menu__list">
          {this.renderSteps()}
        </div>
      </div>
    );
  }
}

export default SelectStep;

const { string, bool, func, number } = PropTypes;

SelectStep.propTypes = {
  onClick: func.isRequired,
  numberOfCompleted: number,
  steps: listOf(mapContains({
    id: string,
    title: string,
    current: bool,
    next: bool,
  })),
};
