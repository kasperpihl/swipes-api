import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import CompatibleLogin from './CompatibleLogin';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
    };
    setupLoading(this);
  }
  componentDidMount() {
  }
  onNavigateToSignup(e) {
    const { history } = this.props;
    history.push('/signup');

    return false;
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onSignin() {
    
  }
  onResetPassword(email) {
    const { request } = this.props;

    if (email && email.length) {
      request('me.sendResetEmail', {
        email: email,
      }).then((res) => {
        window.alert('We will send you an email to change your password.');
      });
    }
  }
  render() {
    const { formData } = this.state;

    return (
      <CompatibleCard>
        <CompatibleLogin
          delegate={this}
          formData={formData}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleLogin.propTypes = {};

const mapStateToProps = (state) => ({
});

export default withRouter(connect(mapStateToProps, {
  request: ca.api.request,
})(HOCCompatibleLogin));
