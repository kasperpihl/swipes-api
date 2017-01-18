import React, { Component, PropTypes } from 'react';
import './styles/current-step';

class CurrentStep extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="current-step">
        <div className="current-step__item current-step__item--prev">Write Specs</div>
        <div className="current-step__item current-step__item--current">Deliver Design</div>
        <div className="current-step__item current-step__item--next">Take Decisions on Design</div>
      </div>
    );
  }
}

export default CurrentStep;

const { string } = PropTypes;

CurrentStep.propTypes = {
  prev: string,
  current: string,
  next: string,
};
