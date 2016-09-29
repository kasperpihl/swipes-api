import React, { Component, PropTypes } from 'react'
class Delivery extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
export default Delivery

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Delivery.propTypes = {
  removeThis: string.isRequired
}