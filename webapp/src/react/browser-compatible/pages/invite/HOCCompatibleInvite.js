import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { string } from 'valjs';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { fromJS } from 'immutable';
import CompatibleInvite from './CompatibleInvite';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

@connect(state => ({
  isBrowserSupported: state.globals.get('isBrowserSupported'),
  readyInOrg: state.connection.get('readyInOrg'),
}), {
  sendInvite: ca.organizations.inviteUser,
})

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invites: fromJS([
        { firstName: '', email: '' },
        { firstName: '', email: '' },
      ])
    };
    setupLoading(this);
  }
  onNameChange(i, value) {
    let { invites } = this.state;
    invites = invites.setIn([i, 'firstName'], value);
    this.setState({ invites });
  }

  onEmailChange(i, value) {
    let { invites } = this.state;
    invites = invites.setIn([i, 'email'], value);
    this.setState({ invites });
  }
  onAddInput() {
    let { invites } = this.state;
    invites = invites.push(fromJS({ firstName: '', email: '' }));
    this.setState({ invites });
  }
  onSendInvites() {
    const { invites } = this.state;
    const { sendInvite } = this.props;

    invites.forEach((inv, i) => {
      const email = inv.get('email');
      const firstName = inv.get('firstName');
      if(!email.length && !firstName.length) return;

      if(this.isLoading(i) || this.getLoading(i).success) return;

      let emailError;
      let nameError;

      if(!email.length && firstName.length) {
        emailError = '!Missing email';
      } else if(email.length && !firstName.length) {
        nameError = '!Missing name';
      }
      if(string.format('email').test(email)) {
        emailError = '!Invalid email';
      }

      this.clearLoading(i+'email', emailError);
      this.clearLoading(i+'name', nameError);
      if(emailError || nameError) {
        return;
      }

      this.setLoading(i);
      sendInvite(firstName, email).then((res) => {
        if(res.ok) {
          this.clearLoading(i, 'Invited');
        } else {
          this.clearLoading(i, '!Error', 5000);
        }
      });
    })
  }
  render() {
    const { invites } = this.state;

    return (
      <CompatibleCard>
        <CompatibleInvite
          delegate={this}
          invites={invites}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
