import React, { Component, PropTypes } from 'react';
import ProgressBar from 'progressbar.js';

class ProgressCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { value } = this.props;

    const bar = new ProgressBar.Circle(this.refs.toastProgress, {
      color: '#000C2F',
      strokeWidth: 7,
      trailWidth: 5,
      easing: 'easeInOut',
      duration: 1000,
      text: {
        autoStyleContainer: false,
      },
      step(state, circle) {
        circle.path.setAttribute('stroke', 'url(#linear)');
        circle.path.setAttribute('stroke-width', '7');

        const newValue = `${Math.round(circle.value() * 100)}%`;

        if (newValue === 0) {
          circle.setText('');
        } else {
          circle.setText(newValue);
        }
      },
    });

    bar.text.style.fontFamily = 'Roboto';
    bar.text.style.fontSize = '15px';

    bar.animate(value);
    this.bar = bar;
  }
  componentWillReceiveProps(nextProps) {
    this.bar.animate(nextProps.value);
  }
  render() {
    return (
      <div ref="toastProgress" style={{ width: '80%', height: '80%' }}>
        <svg className="svg svg--defs">
          <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fc00ff" />
              <stop offset="100%" stopColor="#00dbde" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
}

export default ProgressCircle;

const { number } = PropTypes;

ProgressCircle.propTypes = {
  value: number,
};
