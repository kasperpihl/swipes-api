import React, { Component, PropTypes } from 'react'
import './styles/sassFile.scss'

class NoteDraft extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="className"></div>
    )
  }
}

export default NoteDraft

const { string } = PropTypes;

NoteDraft.propTypes = {
  removeThis: string.isRequired
}
