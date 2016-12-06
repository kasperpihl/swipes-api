import React, { Component, PropTypes } from 'react';
import { listOf, map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Activity from './Activity';
import './styles/activity.scss';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {};
  }
  componentDidMount() {

  }
  renderActivities(activities) {
    if (!activities) {
      return undefined;
    }

    return activities.map((activity, i) => <Activity key={`activity-${i}`} data={activity} cardDelegate={this.props.cardDelegate} />);
  }
  render() {
    const { activities } = this.props;

    return (
      <div className="activity-wrapper">
        {this.renderActivities(activities)}
      </div>
    );
  }
}

export default Activities;
const { object } = PropTypes;
Activities.propTypes = {
  cardDelegate: object.isRequired,
  activities: listOf(map),
};
