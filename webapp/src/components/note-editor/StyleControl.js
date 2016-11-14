import React, { Component, PropTypes } from 'react'

class StyleControl extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="style-control"></div>
    )
  }
}

export default StyleControl

const { string } = PropTypes;

StyleControl.propTypes = {
}
