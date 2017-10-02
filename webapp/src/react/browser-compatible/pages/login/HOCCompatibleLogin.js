import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import CompatibleLogin from './CompatibleLogin';

class HOCCompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onSignin() {
    
  }
  onResetPassword(email) {
    if (email && email.length) {
      request('me.sendResetEmail', {
        email: email,
      }).then((res) => {
        window.alert('We will send you an email to change your password.');
      });
    }
  }
  render() {
    return (
      <CompatibleLogin delegate={this} />
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleLogin.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  request: ca.api.request,
})(HOCCompatibleLogin);
