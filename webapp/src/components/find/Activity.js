import React, { Component, PropTypes } from 'react'

import SwipesCard from '../swipes-card/SwipesCard'

class Activity extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderStory(date, message) {
    return (
      <div className="story">
        <div className="story__timestamp">{date.toString()}</div>
        <div className="story__message">{message}</div>
      </div>
    )
  }
  renderCard(shortUrl) {

    return (
      <SwipesCard title="Testing file" subtitle="Uploaded yesterday" />
    )
  }
  render() {
    const { shortUrl, date, message } = this.props.data;

    return (
      <div className="activity">
        {this.renderStory(date, message)}
        {this.renderCard(shortUrl)}
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
