import React, { Component, PropTypes } from 'react';

import './styles/progress-bar';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderTooltip() {
    const { steps } = this.props;

    const stepsHTML = steps.map((step, i) => {
      let className = 'tooltip';

      if (step.get('completed')) {
        className += ' tooltip--completed';
      }

      return (
        <div className={className} key={i}>
          <div className="tooltip__title">{i + 1}. {step.get('title')}</div>
          <div className="tooltip__assignee">{step.get('assignees').toJS()[0]}</div>
        </div>
      );
    });

    const className = 'progress-bar__tooltip';

    return (
      <div className={className}>
        {stepsHTML}
      </div>
    );
  }
  render() {
    const {
      length,
      completed,
      onClick,
    } = this.props;
    const styles = {};
    console.log('completed', completed);

    if (completed) {
      const progressLength = 100 - ((completed * 100) / length);
      styles.WebkitClipPath = `inset(0 ${progressLength}% 0 0 round 5px)`;
    }

    return (
      <div className="progress-bar" onClick={onClick}>
        <div className="progress-bar__progress" style={styles} />
        {this.renderTooltip()}
      </div>
    );
  }
}

export default ProgressBar;

const { number, func } = PropTypes;

ProgressBar.propTypes = {
  length: number.isRequired,
  completed: number.isRequired,
  onClick: func,
};
