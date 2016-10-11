import React, { Component, PropTypes } from 'react'
import { timeAgo } from '../../classes/time-utils'
import SwipesCard from '../swipes-card/SwipesCard'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Activity extends Component {
  constructor(props) {
    super(props)
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
    )
  }
  renderCard(data, checksum) {
    let meta = data.get('meta');
    meta = meta.set('checksum', data.get('checksum'));
    return (
      <SwipesCard data={meta.toJS()} delegate={this.props.cardDelegate} />
    )
  }
  render() {
    const { data } = this.props;
    return (
      <div className="activity">
        {this.renderStory(data)}
        {this.renderCard(data)}
      </div>
    )
  }
}

export default Activity

const { string, object } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

Activity.propTypes = {
  cardDelegate: object.isRequired,
  data: mapContains({
    message: string.isRequired,
    short_url: string,
    date: string,
    service: string
  })
}
