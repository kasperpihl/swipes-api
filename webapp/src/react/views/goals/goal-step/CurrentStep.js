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
      <div className="current-step" />
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
