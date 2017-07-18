import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from '../../actions';
import * as ca from '../../../swipes-core-js/actions';
import { navForContext } from '../../../swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Notifications from './Notifications';

class HOCNotifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  onMark(ids) {
    const { markNotifications } = this.props;

    markNotifications(ids).then(() => {
    });
  }
  onMarkAll() {
    const { notifications } = this.props;
    const nToMark = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));
    this.onMark(nToMark)
  }
  onNotificationOpen(n) {
    const nav = navForContext(n.get('target'));

    console.log('====================================');
    console.log(nav);
    console.log('====================================');

    // this.onMark([n.get('id')]);
  }
  render() {
    const { notifications } = this.props;
    const sortedNotifications = notifications; //.filter(n => !!n.get('event_type'));

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
    notifications: state.get('notifications'),
  };
}
export default connect(mapStateToProps, {
  markNotifications: ca.notifications.mark,
})(HOCNotifications);
