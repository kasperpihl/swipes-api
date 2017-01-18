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
    const { prev, current, next } = this.props;

    return (
      <div className="current-step">
        <div className="current-step__item current-step__item--prev">{prev}</div>
        <div className="current-step__item current-step__item--current">{current}</div>
        <div className="current-step__item current-step__item--next">{next}</div>
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
