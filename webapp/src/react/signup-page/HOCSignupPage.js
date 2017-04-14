import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import SignupPage from './SignupPage';

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
        if(res.user_id) {
          window.analytics.signedUp(res.user_id);
        }
        window.analytics.sendEvent('Signed up', {})
      }
      console.log('ressy', res);
    });
  }
  renderContent() {
    const { formData, organization } = this.state;

    return (
      <SignupPage
        formData={formData}
        delegate={this}
        organization={organization}

      />
    );
  }
  render() {
    return (
      <div className="signup">
        <div className="header header--mobile">
          <div className="breadcrumbs">
            <div className="breadcrumb breadcrumb--active">1.SIGNUP</div>
            <div className="breadcrumb ">2. Download</div>
          </div>
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
              <path d="M103.416,48.168h0A11.063,11.063,0,0,0,98.469,47h-65.3a3.11483,3.11483,0,0,1-3.165-2.839A3.0001,3.0001,0,0,1,33,41h70.75L120,15H30.642C13.865,15-.273,28.729.004,45.504a29.99619,29.99619,0,0,0,16.58,26.328l.026.013A11.43686,11.43686,0,0,0,21.726,73H87a3.11355,3.11355,0,0,1,3.165,2.84A2.99983,2.99983,0,0,1,87.169,79H16.25L0,105H89.358c16.777,0,30.914-13.729,30.638-30.504a29.99738,29.99738,0,0,0-16.58-26.328" stroke="transparent" />
            </svg>
          </div>
        </div>
        <div className="card">
          <div className="header">
            <div className="breadcrumbs">
              <div className="breadcrumb breadcrumb--active">1.SIGNUP</div>
              <div className="breadcrumb ">2. Download</div>
            </div>
            <div className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                <path d="M103.416,48.168h0A11.063,11.063,0,0,0,98.469,47h-65.3a3.11483,3.11483,0,0,1-3.165-2.839A3.0001,3.0001,0,0,1,33,41h70.75L120,15H30.642C13.865,15-.273,28.729.004,45.504a29.99619,29.99619,0,0,0,16.58,26.328l.026.013A11.43686,11.43686,0,0,0,21.726,73H87a3.11355,3.11355,0,0,1,3.165,2.84A2.99983,2.99983,0,0,1,87.169,79H16.25L0,105H89.358c16.777,0,30.914-13.729,30.638-30.504a29.99738,29.99738,0,0,0-16.58-26.328" stroke="transparent" />
              </svg>
            </div>
          </div>

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
