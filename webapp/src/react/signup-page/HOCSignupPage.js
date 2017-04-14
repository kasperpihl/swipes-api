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
    };
    setupLoading(this);
  }
  componentDidMount() {
    window.analytics.sendEvent('Signup opened', {});
    const { request } = this.props;
    const { formData, invitationToken } = this.state;
    request('organizations.getInfoFromInvitationToken', {
      invitation_token: invitationToken,
    }).then((res) => {
      if (res && res.ok) {
        const me = fromJS(res.me);
        if (me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation opened', {});
        }
        const firstName = msgGen.users.getFirstName(me);
        const email = msgGen.users.getEmail(me);
        this.setState({
          organization: fromJS(res.organization),
          invitedBy: fromJS(res.invited_by),
          me,
          formData: formData.set('email', email).set('firstName', firstName),
        });
      }

      console.log('ressy', res);
    });
    console.log(window.getURLParameter('invitation_token'));
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onClick() {
    console.log('clicky!');
    const { formData, invitationToken, me } = this.state;
    const { signup } = this.props;
    signup({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken,
    }).then((res) => {
      if (res.ok && me && me.get('invited_by')) {
        window.analytics.sendEvent('Invitation accepted', {
          distinct_id: me.get('invited_by'),
          // 'Minutes since invite':
        });
      }
      if (res.ok) {
        if (res.user_id) {
          window.analytics.signedUp(res.user_id);
        }
        window.analytics.sendEvent('Signed up', {});
      }
      console.log('ressy', res);
    });
  }
  renderContent() {
    const { formData, organization, invitedBy } = this.state;
    const { token } = this.props;
    if (true) {
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
      />
    );
  }
  render() {
    const { token } = this.props;
    const headerProps = {
      crumbs: ['SIGNUP', 'DOWNLOAD'],
      activeCrumb: token ? 1 : 0,
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

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: ca.api.request,
  signup: ca.users.signup,
})(HOCSignupPage);
