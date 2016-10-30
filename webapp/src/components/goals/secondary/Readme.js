import React, { Component, PropTypes } from 'react'

import '../styles/readme.scss'

class Readme extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>Readme</div>
    )
  }
}

export default Readme

const { string } = PropTypes;

Readme.propTypes = {}
