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
      <div className="swipes-activities__activity__story">
        <div className="swipes-activities__activity__story--timestamp">{timeAgo(dateString)}</div>
        <div className="swipes-activities__activity__story--message">{message}</div>
      </div>
    )
  }
  renderCard(shortUrl) {
    return (
      <SwipesCard dataId={shortUrl} dataDelegate={this.props.cardDataDelegate} />
    )
  }
  render() {
    const { shortUrl, date, message } = this.props.data;

    return (
      <div className="swipes-activities__activity">
        {this.renderStory(date, message)}
        {this.renderCard(shortUrl)}
      </div>
    )
  }
}

export default Activity

Activity.propTypes = {
  cardDataDelegate: PropTypes.func,
  data: PropTypes.shape({
    message: PropTypes.string.isRequired,
    shortUrl: PropTypes.string,
    date: PropTypes.string,
    service: PropTypes.string
  })
}
