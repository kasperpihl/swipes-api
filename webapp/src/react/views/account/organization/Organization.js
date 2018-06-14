import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button';
import Section from 'components/section/Section';
import FloatingFormInput from './FloatingFormInput';
import TabBar from 'components/tab-bar/TabBar';
import styles from './Organization.swiss';

const User = styleElement('div', styles.User);
const UserImage = styleElement('div', styles.UserImage);
const UserName = styleElement('div', styles.UserName);
const UserEmail = styleElement('div', styles.UserEmail);
const UserType = styleElement('div', styles.UserType);
const Form = styleElement('div', styles.Form);
const InputWrapper = styleElement('div', styles.InputWrapper);
const Input = styleElement('div', styles.Input);
const CTA = styleElement(Button, styles.CTA);

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
        <User className="organization__user" key={u.get('id')}>
          <UserImage className="organization__user-image">
            <HOCAssigning assignees={[u.get('id')]} size={30} />
          </UserImage>
          <UserName className="organization__user-name">
            {msgGen.users.getFullName(u)}{u.get('pending') ? ' (pending)' : null}
          </UserName>
          <UserEmail className="organization__user-email">
            {msgGen.users.getEmail(u)}
          </UserEmail>
          <UserType className="organization__user-type">
            {userLevel}
          </UserType>
          {this.renderActionButton(u)}
        </User>
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
      <Form className="organization__form">

        <InputWrapper className="organization__input-wrapper">
          <Input className="organization__input">
            <FloatingFormInput
              id="org-first-name"
              label="First name"
              type="text"
              disabled={isLoading('invite')}
              value={firstNameVal}
              onChange={this.onChangeCached('firstNameVal')}
            />
          </Input>
          <Input className="organization__input">
            <FloatingFormInput
              id="org-email"
              label="name@company.com"
              type="email"
              value={emailVal}
              disabled={isLoading('invite')}
              onKeyDown={this.onKeyDown}
              onChange={this.onChangeCached('emailVal')}
            />
          </Input>
        </InputWrapper>

        <CTA
          onClick={this.onInvite}
          title="Invite"
          {...getLoading('invite')}
        />
      </Form>
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
