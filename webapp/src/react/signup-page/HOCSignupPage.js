import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import SignupPage from './SignupPage';
import SignupHeader from './SignupHeader';
import DownloadPage from './DownloadPage';

import './styles/signup.scss';
const defLinks = {
  darwin: 'http://swipesapp.com/download-mac',
  win32: 'http://swipesapp.com/download-win',
  linux: 'http://swipesapp.com/download-linux',
  android: 'http://swipesapp.com/download-android',
  ios: 'http://swipesapp.com/download-ios',
};

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
    console.log('did mount');
    window.analytics.sendEvent('Signup opened', {});
    const { request, forceDownload, history } = this.props;
    const { createOrganization, formData, invitationToken } = this.state;
    if(invitationToken && !forceDownload) {
      this.setLoading('signup');

      request('organizations.getInfoFromInvitationToken', {
        invitation_token: invitationToken,
      }).then((res) => {
        this.clearLoading('signup');
        if (res && res.ok && !this._unmounted) {
          if(res.me) {
            const me = fromJS(res.me);
            window.analytics.sendEvent('Invitation opened', {});

            const firstName = msgGen.users.getFirstName(me);
            const email = msgGen.users.getEmail(me);
            if(me.get('activated')) {
              history.push('/download');
            } else {
              this.setState({
                organization: fromJS(res.organization),
                invitedBy: fromJS(res.invited_by),
                me,
                formData: formData.set('email', email).set('firstName', firstName),
              });
            }
          } else {
            this.setState({
              createOrganization: true,
            });
          }
        }
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
  onClick() {
    const { formData, invitationToken, me, createOrganization } = this.state;
    const { signup, createOrgRequest, history } = this.props;
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
      if (res.ok) {
        window.analytics.sendEvent('Signed up', {});
        if(createOrganization){
          window.analytics.sendEvent('Organization created', {});
        }
        if(me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation accepted', {
            distinct_id: me.get('invited_by'),
            // 'Minutes since invite':
          });
        }
        history.push('/download');
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
      invitationToken,
      createOrganization,
    } = this.state;
    const { forceDownload } = this.props;
    const { token } = this.props;

    if (this.getLoading('signup').loading) {
      return (
        <div className="signup__loader">
          <img src="https://media.giphy.com/media/cZDRRGVuNMLOo/giphy.gif" alt="" />
        </div>
      );
    }

    if (forceDownload) {
      return (
        <DownloadPage
          downloadLinks={defLinks}
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
    const { token, forceDownload } = this.props;
    const headerProps = {
      crumbs: ['SIGNUP', 'DOWNLOAD'],
      activeCrumb: forceDownload ? 1 : 0,
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

export default withRouter(connect(mapStateToProps, {
  request: ca.api.request,
  signup: ca.users.signup,
})(HOCSignupPage));
