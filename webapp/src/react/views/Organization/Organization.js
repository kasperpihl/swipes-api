import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'src/react/app/view-controller/SWView';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/Button/Button';
import TabBar from 'src/react/components/tab-bar/TabBar';
import SW from './Organization.swiss';

class Organization extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(
      this,
      'onInvite',
      'onKeyDown',
      'onContext',
      'onChange',
      'onThreeDots'
    );
  }
  renderActionButton(u) {
    const { isAdmin, getLoading } = this.props;
    if (!isAdmin) {
      return undefined;
    }
    return (
      <div className="organization__user-actions">
        <Button
          icon="ThreeDots"
          onClick={this.onContextCached(u.get('id'))}
          {...getLoading(u.get('id'))}
        />
      </div>
    );
  }
  renderUsers() {
    const { users, organization } = this.props;

    const usersHTML = users
      .map(u => {
        let userLevel = 'USER';
        if (
          organization.get('admins') &&
          organization.get('admins').indexOf(u.get('id')) !== -1
        ) {
          userLevel = 'ADMIN';
        }
        if (u.get('id') === organization.get('owner_id')) {
          userLevel = 'OWNER';
        }
        if (u.get('disabled')) {
          userLevel = 'DISABLED';
        }

        return (
          <SW.User key={u.get('id')}>
            <SW.UserImage>
              <HOCAssigning assignees={[u.get('id')]} size={30} />
            </SW.UserImage>
            <SW.UserName>
              {msgGen.users.getFullName(u)}
              {u.get('pending') ? ' (pending)' : null}
            </SW.UserName>
            <SW.UserEmail>{msgGen.users.getEmail(u)}</SW.UserEmail>
            <SW.UserType>{userLevel}</SW.UserType>
            {this.renderActionButton(u)}
          </SW.User>
        );
      })
      .toArray();

    return <div className="organization__user-list">{usersHTML}</div>;
  }
  renderInvite() {
    const {
      getLoading,
      isLoading,
      firstNameVal,
      emailVal,
      tabIndex
    } = this.props;
    if (tabIndex === 1) {
      return undefined;
    }
    return (
      <SW.Form>
        <SW.InputWrapper>
          <SW.Input
            type="text"
            placeholder="First name"
            onKeyDown={this.onKeyDown}
            value={firstNameVal}
            disabled={isLoading('invite')}
            onChange={e => {
              this.onChange('firstNameVal', e.target.value);
            }}
          />
          <SW.Input
            type="text"
            placeholder="Email"
            onKeyDown={this.onKeyDown}
            value={emailVal}
            disabled={isLoading('invite')}
            onChange={e => {
              this.onChange('emailVal', e.target.value);
            }}
          />
        </SW.InputWrapper>

        <SW.CTA
          onClick={this.onInvite}
          title="Invite"
          {...getLoading('invite')}
        />
      </SW.Form>
    );
  }
  renderHeader() {
    const { tabIndex, delegate, tabs, getLoading } = this.props;
    const title = `Team account`;

    return (
      <div className="orgnization__header">
        <CardHeader title={title} subtitle="Invite your team and manage access">
          <Button
            icon="ThreeDots"
            onClick={this.onThreeDots}
            {...getLoading('threedots')}
          />
        </CardHeader>
        <TabBar tabs={tabs} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="organization">
          {this.renderInvite()}
          {this.renderUsers()}
        </div>
      </SWView>
    );
  }
}

export default Organization;
