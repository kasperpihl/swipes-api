import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withOptimist } from 'react-optimist';
import request from 'swipes-core-js/utils/request';
import * as invitationActions from 'src/redux/invitation/invitationActions';
import SW from './Invitation.swiss';

@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg')
  }),
  {
    invitationClear: invitationActions.clear
  }
)
@withOptimist
export default class Invitation extends PureComponent {
  handleDecline = () => {
    const { invitationClear } = this.props;
    invitationClear();
  };
  handleJoin = () => {
    const { invitedToOrg, invitationClear, optimist } = this.props;
    optimist.set('JoinButtonLoading', true);
    request('organization.join', {
      invitation_token: invitedToOrg.get('invitation_token')
    }).then(res => {
      optimist.unset('JoinButtonLoading');
      if (res.ok) {
        invitationClear();
      }
    });
  };
  render() {
    const { invitedToOrg, optimist } = this.props;
    if (!invitedToOrg) {
      return null;
    }

    return (
      <SW.PopupWrapper>
        <SW.Popup>
          <SW.Title>Join {invitedToOrg.get('name')}</SW.Title>
          <SW.Paragraph>
            Do you want to join the team "{invitedToOrg.get('name')}"?
          </SW.Paragraph>
          <SW.Actions>
            <SW.Button
              title="Join"
              onClick={this.handleJoin}
              loading={optimist.get('JoinButtonLoading')}
            />
            <SW.Button title="Decline" onClick={this.handleDecline} />
          </SW.Actions>
        </SW.Popup>
      </SW.PopupWrapper>
    );
  }
}
