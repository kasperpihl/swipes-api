import React, { Component, PropTypes } from 'react'
class Textarea extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <textarea />
    )
  }
}
export default Textarea

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Textarea.propTypes = {
}