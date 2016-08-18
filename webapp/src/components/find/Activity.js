import React, { Component, PropTypes } from 'react'
import { timeAgo } from '../../classes/time-utils'
import SwipesCard from '../swipes-card/SwipesCard'

class Activity extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderStory(dateString, message) {
    return (
      <div className="story">
        <div className="story__timestamp">{timeAgo(dateString)}</div>
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
    date: PropTypes.string,
    service: PropTypes.string
  })
}
