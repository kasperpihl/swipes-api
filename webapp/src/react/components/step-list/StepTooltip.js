import React, { Component, PropTypes } from 'react';

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
