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
    window.analytics.sendEvent('Signup opened', {});
    const { request } = this.props;
    const { createOrganization, formData, invitationToken } = this.state;
    if(invitationToken) {
      this.setLoading('signup');

      request('organizations.getInfoFromInvitationToken', {
        invitation_token: invitationToken,
      }).then((res) => {
        this.clearLoading('signup');
        if (res && res.ok) {
          if(res.me) {
            const me = fromJS(res.me);
            if (me && me.get('invited_by')) {
              window.analytics.sendEvent('Invitation opened', {});
            }
            const firstName = msgGen.users.getFirstName(me);
            const email = msgGen.users.getEmail(me);
            this.setState({
              forceDownload: !!me.get('activated'),
              downloadLinks: res.download_links,
              organization: fromJS(res.organization),
              invitedBy: fromJS(res.invited_by),
              me,
              formData: formData.set('email', email).set('firstName', firstName),
            });
          } else {
            this.setState({
              downloadLinks: res.download_links,
              createOrganization: true,
            });
          }

        }

        console.log('ressy', res);
      });
    }

  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onClick() {
    const { formData, invitationToken, me, createOrganization } = this.state;
    const { signup, createOrgRequest } = this.props;
    this.setLoading('signupButton');
    signup({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      organization_name: createOrganization ? formData.get('organizationName') : undefined,
      invitation_token: createOrganization ? undefined : invitationToken,
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
        if(createOrganization){
          window.analytics.sendEvent('Organization created', {});
        }
      }
      console.log('ressy', res);
    });
  }
  renderContent() {
    const {
      formData,
      organization,
      invitedBy,
      hasLoaded,
      forceDownload,
      downloadLinks,
      invitationToken,
      createOrganization,
    } = this.state;
    const { token } = this.props;

    if (this.getLoading('signup').loading) {
      return (
        <div className="signup__loader">
          <img src="https://media.giphy.com/media/cZDRRGVuNMLOo/giphy.gif" alt="" />
        </div>
      );
    }

    if (forceDownload || token) {
      return (
        <DownloadPage
          downloadLinks={downloadLinks}
        />
      );
    }
    return (
      <SignupPage
        formData={formData}
        delegate={this}
        organization={organization}
        invitationToken={invitationToken}
        createOrganization={createOrganization}
        inviter={invitedBy}
        {...this.bindLoading()}
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
