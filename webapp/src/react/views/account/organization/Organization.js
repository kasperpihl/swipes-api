import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button';
import Section from 'components/section/Section';
import FloatingFormInput from './FloatingFormInput';
import TabBar from 'components/tab-bar/TabBar';
import SW from './Organization.swiss';

class Organization extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onInvite', 'onKeyDown', 'onContext', 'onChange', 'onThreeDots');
  }
  renderActionButton(u) {
    const { isAdmin, getLoading } = this.props;
    if(!isAdmin){
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
    )
  }
  renderUsers() {
    const { users, organization } = this.props;

    const usersHTML = users.map((u) => {
      let userLevel = 'USER';
      if (organization.get('admins') && organization.get('admins').indexOf(u.get('id')) !== -1) {
        userLevel = 'ADMIN';
      }
      if (u.get('id') === organization.get('owner_id')) {
        userLevel = 'OWNER';
      }
      if(u.get('disabled')) {
        userLevel = 'DISABLED';
      }

      return (
        <SW.User key={u.get('id')}>
          <SW.UserImage>
            <HOCAssigning assignees={[u.get('id')]} size={30} />
          </SW.UserImage>
          <SW.UserName>
            {msgGen.users.getFullName(u)}{u.get('pending') ? ' (pending)' : null}
          </SW.UserName>
          <SW.UserEmail>
            {msgGen.users.getEmail(u)}
          </SW.UserEmail>
          <SW.UserType>
            {userLevel}
          </SW.UserType>
          {this.renderActionButton(u)}
        </SW.User>
      );
    }).toArray();

    return (
      <div className="organization__user-list">
        {usersHTML}
      </div>
    );
  }
  renderInvite() {
    const { getLoading, isLoading, firstNameVal, emailVal, tabIndex } = this.props;
    if(tabIndex === 1) {
      return undefined;
    }
    return (
      <SW.Form>

        <SW.InputWrapper>
          <SW.Input>
            <FloatingFormInput
              id="org-first-name"
              label="First name"
              type="text"
              disabled={isLoading('invite')}
              value={firstNameVal}
              onChange={this.onChangeCached('firstNameVal')}
            />
          </SW.Input>
          <SW.Input>
            <FloatingFormInput
              id="org-email"
              label="name@company.com"
              type="email"
              value={emailVal}
              disabled={isLoading('invite')}
              onKeyDown={this.onKeyDown}
              onChange={this.onChangeCached('emailVal')}
            />
          </SW.Input>
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
    const { organization, tabIndex, delegate, tabs, getLoading } = this.props;
    const title = `Team account`;

    return (
      <div className="orgnization__header">
        <HOCHeaderTitle title={title} subtitle="Invite your team and manage access">
          <Button
            icon="ThreeDots"
            onClick={this.onThreeDots}
            {...getLoading('threedots')}
          />
        </HOCHeaderTitle>
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
