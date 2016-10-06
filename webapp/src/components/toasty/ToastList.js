import React, { Component, PropTypes } from 'react'
import Toast from './Toast'
import './styles/toast-list.scss'

class name extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { data } = this.props;

    const toasts = data.map( (toast, i) => {
      return <Toast data={toast} key={'toast-' + i}/>
    })

    return (
      <div className="toast-list">{toasts}</div>
    )
  }
}

export default name

const { string } = PropTypes;

name.propTypes = {
  // removeThis: string.isRequired
}
