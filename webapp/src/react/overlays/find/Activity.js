import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { mapContains } from 'react-immutable-proptypes';
import { timeAgo } from 'classes/time-utils';
import SwipesCard from 'components/swipes-card/SwipesCard';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {

  }
  renderStory(data) {
    const date = data.get('date');
    const message = data.get('message');
    return (
      <div className="activity__story">
        <span className="activity__timestamp">{timeAgo(date)}</span>
        <span className="activity__message">{message}</span>
      </div>
    );
  }
  renderCard(data) {
    let meta = data.get('meta');

    meta = meta.set('checksum', data.get('checksum')).set('service', data.get('service_name'));

    return (
      <SwipesCard data={meta.toJS()} delegate={this.props.cardDelegate} />
    );
  }
  render() {
    const { data } = this.props;
    return (
      <div className="activity">
        {this.renderStory(data)}
        {this.renderCard(data)}
      </div>
    );
  }
}

export default Activity;

const { string, object } = PropTypes;

Activity.propTypes = {
  cardDelegate: object.isRequired,
  data: mapContains({
    message: string.isRequired,
    short_url: string,
    date: string,
    service: string,
  }),
};
