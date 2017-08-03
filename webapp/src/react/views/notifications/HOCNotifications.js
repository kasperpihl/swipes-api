import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, navForContext } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Notifications from './Notifications';

class HOCNotifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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
  onMark(ids) {
    const { markNotifications } = this.props;
    if(!ids.length) {
      return;
    }
    this.setLoading('marking');
    markNotifications(ids).then(() => {
      if (!this._unmounted) {
        this.clearLoading('marking');
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
    openSecondary('primary', nav);
    hide();
  }
  render() {
    const { notifications } = this.props;
    const sortedNotifications = notifications; //.filter(n => !!n.get('event_type'));
    return (
      <Notifications
        delegate={this}
        notifications={sortedNotifications}
        {...this.bindLoading()}
      />
    );
  }
}

// const { string } = PropTypes;
HOCNotifications.propTypes = {};
function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
  };
}
export default connect(mapStateToProps, {
  openSecondary: a.navigation.openSecondary,
  markNotifications: ca.notifications.mark,
  setLastReadTs: ca.notifications.setLastReadTs,
})(HOCNotifications);
