import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Notifications from './Notifications';

class HOCNotifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this)
  }
  componentDidMount() {
  }
  render() {
    const { notifications: n } = this.props;

    return (
      <Notifications delegate={this} notifications={n} />
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