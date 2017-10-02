import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import CompatibleSignup from './CompatibleSignup';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

import './styles/signup.scss';
const defLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

class HOCCompatibleSignup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
      invitationToken: window.getURLParameter('invitation_token'),
    };

    setupLoading(this);
  }
  componentWillMount() {
    window.analytics.sendEvent('Signup opened', {});
    const { request, history } = this.props;
    const { formData, invitationToken } = this.state;
    if(invitationToken) {
      this.setLoading('signup');

      request('organizations.getInfoFromInvitationToken', {
        invitation_token: invitationToken,
      }).then((res) => {
        console.log('token', res);
        if (res && res.ok && res.me && !this._unmounted) {
          const me = fromJS(res.me);
          window.analytics.sendEvent('Invitation opened', {});
          const firstName = msgGen.users.getFirstName(me);
          const email = msgGen.users.getEmail(me);
          this.setState({
            organization: fromJS(res.organization),
            invitedBy: fromJS(res.invited_by),
            me,
            formData: formData.set('email', email).set('firstName', firstName),
          });
        }
        this.clearLoading('signup');
      });
    }
  }
  componentWillUnmount(){
    this._unmounted = true;
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onSignup() {
    const { formData, invitationToken, me } = this.state;
    const { signup, createOrgRequest, history } = this.props;
    
    if (this.isLoading('signupButton')) {
      return;
    }


    this.setLoading('signupButton');
    signup({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken || null,
    }).then((res) => {
      this.clearLoading('signupButton');
      if (res.ok) {
        window.analytics.sendEvent('Signed up', {});
        if(me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation accepted', {
            distinct_id: me.get('invited_by'),
            // 'Minutes since invite':
          });
        }
        history.push('/');
      }
      console.log('ressy', res);
    });
  }
  renderContent() {
    const {
      formData,
      organization,
      invitedBy,
      invitationToken,
    } = this.state;

    const { token } = this.props;
    
    if (this.getLoading('signup').loading) {
      return (
        <div className="signup__loader">
          <img src="https://media.giphy.com/media/cZDRRGVuNMLOo/giphy.gif" alt="" />
        </div>
      );
    }

    return (
      <CompatibleSignup
        formData={formData}
        delegate={this}
        organization={organization}
        invitationToken={invitationToken}
        inviter={invitedBy}
        {...this.bindLoading()}
      />
    );
  }
  render() {
    const { token } = this.props;

    return (
      <CompatibleCard>
        {this.renderContent()}
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleSignup.propTypes = {};

function mapStateToProps(state) {
  return {
    token: state.getIn(['connection', 'token']),
  };
}

export default withRouter(connect(mapStateToProps, {
  request: ca.api.request,
  signup: ca.users.signup,
})(HOCCompatibleSignup));
