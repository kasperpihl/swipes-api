import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
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
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onMarkAll() {
    const { markNotifications, notifications } = this.props;
    const nToMark = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));

    this.setLoading('marking');
    markNotifications(nToMark).then(() => {
      if (!this._unmounted) {
        this.clearLoading('marking');
      }
    });
  }
  onNotificationOpen(id) {
    
  }
  render() {
    const { notifications: n } = this.props;

    return (
      <Notifications
        delegate={this}
        notifications={n}
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
})(HOCNotifications);
