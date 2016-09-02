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
        <div className="swipes-activities__header__title">{title}</div>
        <div className="swipes-activities__header__seperator"></div>
        <div className="swipes-activities__header__subtitle">{subtitle}</div>
      </div>
    )
  }
  renderActivities(activities){
    if (!activities) {
      return;
    }
    const { dotDragStart, cardOnClick } = this.props;
    return activities.map( (activity, i) => {
      return <Activity key={"activity-" + i} data={activity} cardDelegate={this.props.cardDelegate} />
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
  cardDelegate: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  activities: PropTypes.arrayOf(PropTypes.object)

}
