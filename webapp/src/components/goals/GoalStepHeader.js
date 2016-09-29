import React, { Component, PropTypes } from 'react'
class GoalStepHeader extends Component {
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
export default GoalStepHeader

const { string, number, shape, bool } = PropTypes;

GoalStepHeader.propTypes = {
  index: number,
  completed: bool,
  active: bool,
  title: string,
  type: string,
  assignees: shape({
    img: string,
    count: number
  })
}