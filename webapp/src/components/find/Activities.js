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
      <div className="swipes-activities__header">
        <div className="swipes-activities__header--title">{title}</div>
        <div className="swipes-activities__header--subtitle">{subtitle}</div>
      </div>
    )
  }
  renderActivities(activities){
    if (!activities) {
      return;
    }
    const { dotDragStart, cardOnClick } = this.props;
    return activities.map( (activity, i) => {
      return <Activity key={"activity-" + i} data={activity} cardOnClick={cardOnClick} dotDragStart={dotDragStart} />
    })
  }
  render() {
    const { title, subtitle, activities } = this.props;

    return (
      <div className="swipes-activities">
        {this.renderHeader(title, subtitle)}
        {this.renderActivities(activities)}
      </div>
    )
  }
}

export default Activities

Activities.propTypes = {
  title: PropTypes.string.isRequired,
  dotDragStart: PropTypes.func,
  subtitle: PropTypes.string,
  activities: PropTypes.arrayOf(PropTypes.object),
  cardOnClick: PropTypes.func

}
