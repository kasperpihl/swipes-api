import React, { Component, PropTypes } from 'react'
import ProgressBar from 'progressbar.js'
import Loader from './../swipes-ui/Loader'
import { CheckmarkIcon } from './../icons'
import './styles/toast.scss'

class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    console.log(this.refs, 'DADADADA')
    const bar = new ProgressBar.Circle( this.refs.toastProgress, {
      color: '#000C2F',
      strokeWidth: 3,
      trailWidth: 2,
      easing: 'easeInOut',
      duration: 5000,
      text: {
        autoStyleContainer: false
      },
      step: function(state, circle) {
        circle.path.setAttribute('stroke', "url(#linear)");
        circle.path.setAttribute('stroke-width', '3');

        const value = Math.round(circle.value() * 100);

        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }
      }
    });

    bar.text.style.fontFamily = 'Roboto';
    bar.text.style.fontSize = '15px';

    bar.animate(1.0);
  }
  renderLoader() {
    const { loading, progress, completed } = this.props.data;

    if (loading && !progress && !completed) {
      return (
        <Loader size={20} mini={true} center={true}/>
      )
    }
  }
  renderProgressbar() {
    const { loading, progress, completed } = this.props.data;

    if (progress && !loading && !completed) {

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
  renderSuccess() {
  const { loading, progress, completed } = this.props.data;

    if (!loading && !progress && completed) {
      return (
        <CheckmarkIcon className="toast__icon"/>
      )
    }
  }
  render() {
    const { title, loading, progress } = this.props.data;

    return (
      <div ref="dada" className="toast">
        <div className="toast__loader">
          {this.renderLoader()}
          {this.renderProgressbar()}
          {this.renderSuccess()}
        </div>
        <div className="toast__title">{title}</div>
      </div>
    )
  }
}

export default Toast

const { string, number, bool, shape } = PropTypes;

Toast.propTypes = {
  data: shape({
    title: string.isRequired,
    loading: bool,
    progress: number,
    completed: bool
  })
}
