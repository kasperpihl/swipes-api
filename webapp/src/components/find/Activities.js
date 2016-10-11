import React, { Component, PropTypes } from 'react'
import Activity from './Activity'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './styles/activity.scss'

class Activities extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {}
  }
  componentDidMount() {

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
    const { activities } = this.props;

    return (
      <div className="activity-wrapper">
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
