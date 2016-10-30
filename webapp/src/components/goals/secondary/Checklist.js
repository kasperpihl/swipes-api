import React, { Component, PropTypes } from 'react'

import '../styles/checklist.scss'

class Checklist extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>Checklist</div>
    )
  }
}

export default Checklist

const { string } = PropTypes;

Checklist.propTypes = {}
