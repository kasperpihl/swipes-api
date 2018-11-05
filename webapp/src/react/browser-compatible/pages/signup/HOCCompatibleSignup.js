import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import request from 'swipes-core-js/utils/request';
import { setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import { fromJS, Map } from 'immutable';
import CompatibleSignup from './CompatibleSignup';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

@connect(
  state => ({
    token: state.auth.get('token'),
  }),
  {
    setUrl: navigationActions.url,
  }
)
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
      invitationToken: getURLParameter('invitation_token'),
    };

    setupLoading(this);
  }
  componentWillMount() {
    window.analytics.sendEvent('Signup opened', {});
    const { request } = this.props;
    const { formData, invitationToken } = this.state;
    if (invitationToken) {
      this.setLoading('signup');

      request('organizations.getInfoFromInvitationToken', {
        invitation_token: invitationToken,
      }).then(res => {
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
  componentWillUnmount() {
    this._unmounted = true;
  }
  onChange(key, value) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, value) });
  }
  onSignup() {
    const { formData, invitationToken, me } = this.state;
    const { createOrgRequest, setUrl } = this.props;

    if (this.isLoading('signupButton')) {
      return;
    }

    this.setLoading('signupButton');
    request('user.signup', {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken || null,
    }).then(res => {
      if (res.ok) {
        this.clearLoading('signupButton');
        window.analytics.sendEvent('Signed up', {});
        if (me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation accepted', {
            distinct_id: me.get('invited_by'),
            // 'Minutes since invite':
          });
        }
        setUrl('/');
      } else {
        let label = '!Something went wrong :/';

        if (res.error && res.error.message) {
          label = '!' + res.error.message;

          if (label.startsWith('!body /users.signup: Invalid object')) {
            let invalidProp = label
              .split('[')[1]
              .split(']')[0]
              .replace("'", '')
              .replace("'", '');

            label = `!Not a valid ${invalidProp}`;
          }
        }

        this.clearLoading('signupButton', label);
      }
    });
  }
  renderContent() {
    const { formData, organization, invitedBy, invitationToken } = this.state;

    const { token } = this.props;

    if (this.isLoading('signup')) {
      return (
        <div className="compatible-signup__loader">
          <img
            src="https://media.giphy.com/media/cZDRRGVuNMLOo/giphy.gif"
            alt=""
          />
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

    return <CompatibleCard>{this.renderContent()}</CompatibleCard>;
  }
}
