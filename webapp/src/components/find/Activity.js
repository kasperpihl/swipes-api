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
        <span className="swipes-activities__activity__story--timestamp">{timeAgo(dateString)}</span>
        <span className="swipes-activities__activity__story--message">{message}</span>
      </div>
    )
  }
  renderCard(data, checksum) {
    return (
      <SwipesCard data={Object.assign({}, data, { checksum })} delegate={this.props.cardDelegate} />
    )
  }
  render() {
    const { meta, checksum, date, message } = this.props.data;
    return (
      <div className="swipes-activities__activity">
        {this.renderStory(date, message)}
        {this.renderCard(meta, checksum)}
      </div>
    )
  }
}

export default Activity

Activity.propTypes = {
  cardDelegate: PropTypes.object.isRequired,
  data: PropTypes.shape({
    message: PropTypes.string.isRequired,
    short_url: PropTypes.string,
    date: PropTypes.string,
    service: PropTypes.string
  })
}
