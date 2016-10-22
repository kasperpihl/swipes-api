import React, { Component, PropTypes } from 'react'
import Loader from './../swipes-ui/Loader'
import ProgressCircle from './ProgressComponent'
import { CheckmarkIcon } from './../icons'
import './styles/toast.scss'

class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
        <ProgressCircle value={progress/100} />
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
      <div className="toast">
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
