import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { navForContext } from 'swipes-core-js/classes/utils';

// import { fromJS } from 'immutable';
import Notifications from './Notifications';

class HOCNotifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { setLastReadTs, notifications } = this.props;
    if (notifications && notifications.size) {
      setLastReadTs(notifications.getIn([0, 'created_at']));
    }
  }
  onMark(ids) {
    const { markNotifications } = this.props;

    markNotifications(ids);
  }
  onMarkAll() {
    const { notifications } = this.props;
    const nToMark = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));
    this.onMark(nToMark);
  }
  onNotificationOpen(n) {
    const { navPush } = this.props;
    const nav = navForContext(n.get('target'));
    this.onMark([n.get('id')]);
    navPush(nav);
  }
  render() {
    const { notifications } = this.props;
    const sortedNotifications = notifications; // .filter(n => !!n.get('event_type'));

    return (
      <Notifications
        delegate={this}
        notifications={sortedNotifications}
      />
    );
  }
}

// const { string } = PropTypes;
HOCNotifications.propTypes = {};
function mapStateToProps(state) {
  return {
    notifications: state.notifications,
  };
}
export default connect(mapStateToProps, {
  markNotifications: ca.notifications.mark,
  setLastReadTs: ca.notifications.setLastReadTs,
})(HOCNotifications);
