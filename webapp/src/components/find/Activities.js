import React, { Component, PropTypes } from 'react'
import Activity from './Activity'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Activities extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
const { string, object } = PropTypes;
import { map, mapOf, list, listOf } from 'react-immutable-proptypes'
Activities.propTypes = {
  title: string.isRequired,
  cardDelegate: object.isRequired,
  subtitle: string,
  activities: listOf(map)
}
