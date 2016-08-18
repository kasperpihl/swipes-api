import React, { Component, PropTypes } from 'react'

import SwipesCard from '../swipes-card/SwipesCard'

class Activity extends Component {
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
export default Activity

Activity.propTypes = {
  data: PropTypes.shape({
    message: PropTypes.string.isRequired,
    shortUrl: PropTypes.string,
    date: PropTypes.object,
    service: PropTypes.string
  })
}