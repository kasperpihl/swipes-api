import React, { Component, PropTypes } from 'react'
import Loader from './../swipes-ui/Loader'
import { CheckmarkIcon } from './../icons'
import './styles/toast.scss'

class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderLoader(loading) {
    if (!loading) {
      return (
        <CheckmarkIcon className="toast__icon"/>
      )
    }

    return (
      <Loader size={20} mini={true} center={true}/>
    )
  }
  render() {
    const { title, loading } = this.props.data;

    return (
      <div className="toast">
        <div className="toast__loader">
          {this.renderLoader(loading)}
        </div>
        <div className="toast__title">{title}</div>
      </div>
    )
  }
}

export default Toast

const { string } = PropTypes;

Toast.propTypes = {
  // removeThis: string.isRequired
}
