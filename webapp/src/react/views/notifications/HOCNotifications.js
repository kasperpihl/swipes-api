import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, navForContext } from 'swipes-core-js/classes/utils';
import Notifications from './Notifications';

@connect(state => ({
  notifications: state.get('notifications'),
}), {
  openSecondary: navigationActions.openSecondary,
  markNotifications: ca.notifications.mark,
  setLastReadTs: ca.notifications.setLastReadTs,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { limit: 10 };
    setupLoading(this);
  }
  componentDidMount() {
    const { setLastReadTs, notifications } = this.props;
    if(notifications && notifications.size) {
      setLastReadTs(notifications.getIn([0, 'created_at']));
    }

  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onReachedEnd() {
    this.setState({ limit: this.state.limit + 10 });
  }
  onMark(ids) {
    const { markNotifications } = this.props;
    if(!ids.length) {
      return;
    }
    this.setLoading('marking');
    markNotifications(ids).then((res) => {
      if(res && res.ok) {
        this.clearLoading('marking', 'Marked', 3000);
      } else {
        this.clearLoading('marking', '!Something went wrong', 3000);
      }
    });
  }
  onMarkAll() {
    const { notifications } = this.props;
    const nToMark = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));
    this.onMark(nToMark)
  }
  onNotificationOpen(n) {
    const nav = navForContext(n.get('target'));
    const { openSecondary, hide } = this.props;
    if(!n.get('seen_at')){
      this.onMark([n.get('id')]);
    }
    if(nav) {
      openSecondary('secondary', nav);
    }
    hide();
  }
  render() {
    const { notifications } = this.props;
    const sortedNotifications = notifications; //.filter(n => !!n.get('event_type'));
    const { limit } = this.state;

    return (
      <Notifications
        limit={limit}
        delegate={this}
        notifications={sortedNotifications}
        {...this.bindLoading()}
      />
    );
  }
}
