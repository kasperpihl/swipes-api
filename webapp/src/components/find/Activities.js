import React, { Component, PropTypes } from 'react'
import Activity from './Activity'

class Activities extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderHeader(title, subtitle) {
    return (
      <div className="header">
        <div className="header__title">{title}</div>
        <div className="header__subtitle">{subtitle}</div>
      </div>
    )
  }
  renderActivities(activities){
    if (!activities) {
      return;
    }
    return activities.map( (activity) => {
      <Activity data={activity} />
    })
  }
  render() {
    const { title, subtitle, activities } = this.props;

    return (
      <div className="swipes-activites">
        {this.renderHeader(title, subtitle)}
        {this.renderActivities(activities)}
      </div>
    )
  }
}

export default Activities

Activities.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  activities: PropTypes.arrayOf(PropTypes.object)
}
