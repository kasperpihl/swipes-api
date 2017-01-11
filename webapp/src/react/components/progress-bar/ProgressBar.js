import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';

import './styles/progress-bar';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      tooltipX: 0,
    };
    bindAll(this, ['handleMouseEnter', 'handleMouseLeave']);
  }
  handleMouseEnter(e) {
    const { showTooltip } = this.state;

    if (!showTooltip) {
      this.setState({ showTooltip: true });
      this.setState({ tooltipX: e.clientX });
    }
  }
  handleMouseLeave(e) {
    const { showTooltip } = this.state;

    if (showTooltip) {
      this.setState({ showTooltip: false });
    }
  }
  renderTooltip() {
    const { steps } = this.props;

    const stepsHTML = steps.map((step, i) => {
      let className = 'progress-bar-tooltip';

      if (step.get('completed')) {
        className += ' progress-bar-tooltip--completed';
      }

      return (
        <div className={className} key={i}>
          <div className="progress-bar-tooltip__title">{i + 1}. {step.get('title')}</div>
          <div className="progress-bar-tooltip__assignee">{step.get('assignees').toJS()[0]}</div>
        </div>
      );
    });

    const { showTooltip, tooltipX } = this.state;
    let className = 'progress-bar__tooltip';

    if (showTooltip) {
      className += ' progress-bar__tooltip--show';
    }

    // const styles = {
    //   left: `${tooltipX - 9}px`,
    // };
    //
    // console.log('styles', styles);

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
    const progressLength = 100 - ((completed * 100) / length);
    const styles = {
      WebkitClipPath: `inset(0 ${progressLength}% 0 0 round 5px)`,
    };

    return (
      <div className="progress-bar" onClick={onClick}>
        <div className="progress-bar__filling" style={styles} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
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
