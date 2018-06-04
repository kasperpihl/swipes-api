import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import HOCLogoutButton from 'compatible/components/logout-button/HOCLogoutButton';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import CompatibleInviteForm from './CompatibleInviteForm';
import GoToWorkspace from 'compatible/components/go-to-workspace/GoToWorkspace';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import styles from './styles/CompatibleInvite.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Form = styleElement('div', styles.Form);
const SendButton = styleElement('div', styles.SendButton);
const Hint = styleElement('div', styles.Hint);

@withRouter
export default class extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onSendInvites', 'onNameChange');
  }

  renderInviteForm() {
    const { delegate, bindLoading, invites } = this.props;

    return (
      <Form>
        <CompatibleInviteForm
          invites={invites}
          delegate={delegate}
          {...bindLoading()}
        />
        <SendButton>
          <CompatibleButton onClick={this.onSendInvites} title="Send Invites" />
        </SendButton>
        <div className="clearfix"></div>
      </Form>
    )
  }
  renderGoToWorkspace() {
    const { location } = this.props;
    if(!location.state || !location.state.goTo) {
      return null;
    }
    const to = {
      pathname: location.state.goTo,
    };
    if(location.state.goTo !== '/') {
      to.state = { goTo: '/' };
    }
    return [
      <br key="1" />,
      <br key="2" />,
      <GoToWorkspace noTitle to={to} key="3" />
    ];
  }
  render() {
    const { location } = this.props;

    return (
      <Wrapper>
        <CompatibleHeader title="Your Workspace is ready!" subtitle="Invite your team to join in or download the app below." />
        {this.renderInviteForm()}
        {this.renderGoToWorkspace()}
      </Wrapper>
    );
  }
}
