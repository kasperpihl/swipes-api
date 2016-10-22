import React, { Component, PropTypes } from 'react'
import ProgressBar from 'progressbar.js'

class ProgressCircle extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillReceiveProps(nextProps) {
    this.bar.animate(nextProps.value);
  }
  componentDidMount() {
    const { value } = this.props

    const bar = new ProgressBar.Circle( this.refs.toastProgress, {
      color: '#000C2F',
      strokeWidth: 3,
      trailWidth: 2,
      easing: 'easeInOut',
      duration: 1000,
      text: {
        autoStyleContainer: false
      },
      step: function(state, circle) {
        circle.path.setAttribute('stroke', "url(#linear)");
        circle.path.setAttribute('stroke-width', '3');

        const value = Math.round(circle.value() * 100) + '%';

        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }
      }
    });

    bar.text.style.fontFamily = 'Roboto';
    bar.text.style.fontSize = '15px';

    bar.animate(value);
    this.bar = bar;
  }
  render() {
    return (
      <div ref="toastProgress">
        <svg className="svg svg--defs">
          <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff66"/>
              <stop offset="33%" stopColor="#0ec4f2"/>
              <stop offset="66%" stopColor="#e609e6"/>
              <stop offset="100%" stopColor="#5c005a"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }
}

export default ProgressCircle

const { number } = PropTypes;

ProgressCircle.propTypes = {
  value: number
}
