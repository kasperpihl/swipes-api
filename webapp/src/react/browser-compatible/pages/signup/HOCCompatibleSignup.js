import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import request from 'swipes-core-js/utils/request';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { fromJS, Map } from 'immutable';
import CompatibleSignup from './CompatibleSignup';
import CompatibleCard from 'src/react/browser-compatible/components/card/CompatibleCard';

@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg')
  }),
  {
    setUrl: navigationActions.url
  }
)
export default class extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }}
  onSignup() {
    const { formData, invitationToken, me } = this.state;
    const { setUrl } = this.props;

    if (this.isLoading('signupButton')) {
      return;
    }

    this.setLoading('signupButton');
    request('user.signup', {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken || null
    }).then(res => {
      if (res.ok) {
        this.clearLoading('signupButton');
        window.analytics.sendEvent('Signed up', {});
        if (me && me.get('invited_by')) {
          window.analytics.sendEvent('Invitation accepted', {
            distinct_id: me.get('invited_by')
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
    const { formData } = this.state;

    return (
      <CompatibleSignup
        formData={formData}
        delegate={this}
        {...this.bindLoading()}
      />
    );
  }
  render() {
    return <CompatibleCard>{this.renderContent()}</CompatibleCard>;
  }
}
