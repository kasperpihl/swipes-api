import React, { Component, PropTypes } from 'react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
export default Form

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Form.propTypes = {
  //removeThis: string.isRequired
}