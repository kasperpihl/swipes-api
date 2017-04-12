import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StepTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {

    return (
      <div className="step-list-item__tooltip">{this.props.tooltipText}</div>
    );
  }
}

export default StepTooltip;
