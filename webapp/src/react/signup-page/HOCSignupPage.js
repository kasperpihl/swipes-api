import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import SignupPage from './SignupPage';
import SignupHeader from './SignupHeader';
import DownloadPage from './DownloadPage';

import './styles/signup.scss';

class HOCSignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
      invitationToken: window.getURLParameter('invitation_token'),
      hasLoaded: false,
    };

    setupLoading(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);

    window.analytics.sendEvent('Signup opened', {});
    const { request } = this.props;
    const { formData, invitationToken } = this.state;
    this.setLoading('signup');
    request('organizations.getInfoFromInvitationToken', {
      invitation_token: invitationToken,
    }).then((res) => {
      this.clearLoading('signup');
      if (res && res.ok) {
        const me = fromJS(res.me);
        if (me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation opened', {});
        }
        const firstName = msgGen.users.getFirstName(me);
        const email = msgGen.users.getEmail(me);
        this.setState({
          forceDownload: !!me.get('activated'),
          organization: fromJS(res.organization),
          invitedBy: fromJS(res.invited_by),
          me,
          formData: formData.set('email', email).set('firstName', firstName),
        });
      }

      console.log('ressy', res);
    });
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onClick() {
    const { formData, invitationToken, me } = this.state;
    const { signup } = this.props;
    this.setLoading('signupButton');
    signup({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken,
    }).then((res) => {
      this.clearLoading('signupButton');
      if (res.ok && me && me.get('invited_by')) {
        window.analytics.sendEvent('Invitation accepted', {
          distinct_id: me.get('invited_by'),
          // 'Minutes since invite':
        });
      }
      if (res.ok) {
        window.analytics.sendEvent('Signed up', {});
      }
      console.log('ressy', res);
    });
  }
  renderContent() {
    const { formData, organization, invitedBy, hasLoaded, forceDownload } = this.state;
    const { token } = this.props;

    if (this.getLoading('signup').loading || !hasLoaded) {
      return (
        <div className="signup__loader">
          <img src="https://media.giphy.com/media/cZDRRGVuNMLOo/giphy.gif" alt="" />
        </div>
      );
    }

    if (forceDownload || token) {
      return (
        <DownloadPage />
      );
    }
    return (
      <SignupPage
        formData={formData}
        delegate={this}
        organization={organization}
        inviter={invitedBy}
        loadingState={this.getAllLoading()}
        getLoading={this.getLoading}
      />
    );
  }
  render() {
    const { forceDownload } = this.state;
    const { token } = this.props;
    const headerProps = {
      crumbs: ['SIGNUP', 'DOWNLOAD'],
      activeCrumb: (token || forceDownload) ? 1 : 0,
    };
    return (
      <div className="signup">
        <SignupHeader {...headerProps} mobile />
        <div className="card">
          <SignupHeader {...headerProps} />
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCSignupPage.propTypes = {};

function mapStateToProps(state) {
  return {
    token: state.getIn(['connection', 'token']),
  };
}

export default connect(mapStateToProps, {
  request: ca.api.request,
  signup: ca.users.signup,
})(HOCSignupPage);
