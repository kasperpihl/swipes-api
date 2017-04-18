import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Button from 'Button';
import Section from 'components/section/Section';
import FloatingFormInput from './FloatingFormInput';

import './styles/organization.scss';

class Organization extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this);
    this.onInvite = this.callDelegate.bind(null, 'onInvite');
    this.onKeyDown = this.callDelegate.bind(null, 'onKeyDown');
    this.onChangeCached = setupCachedCallback(this.onChange, this);
    this.onContextCached = setupCachedCallback(this.callDelegate.bind(null, 'onContext'));
  }
  componentDidMount() {
  }
  onChange(key, val) {
    this.callDelegate('onChange', key, val);
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

      return (
        <div className="organization__user" key={u.get('id')}>
          <div className="organization__user-image">
            <HOCAssigning assignees={[u.get('id')]} rounded size={30} />
          </div>
          <div className="organization__user-name">
            {msgGen.users.getFullName(u)}{u.get('activated') ? null : ' (pending)'}
          </div>
          <div className="organization__user-email">
            {msgGen.users.getEmail(u)}
          </div>
          <div className="organization__user-type">
            {userLevel}
          </div>
          {this.renderActionButton(u)}
        </div>
      );
    }).toArray();

    return (
      <div className="organization__user-list">
        {usersHTML}
      </div>
    );
  }
  renderInvite() {
    const { getLoading, isLoading, firstNameVal, emailVal } = this.props;

    return (
      <div className="organization__form">

        <div className="organization__input-wrapper">
          <div className="organization__input">
            <FloatingFormInput
              id="org-first-name"
              label="First name"
              type="text"
              disabled={isLoading('invite')}
              value={firstNameVal}
              onChange={this.onChangeCached('firstNameVal')}
            />
          </div>
          <div className="organization__input">
            <FloatingFormInput
              id="org-email"
              label="name@company.com"
              type="email"
              value={emailVal}
              disabled={isLoading('invite')}
              onKeyDown={this.onKeyDown}
              onChange={this.onChangeCached('emailVal')}
            />
          </div>
        </div>

        <Button
          onClick={this.onInvite}
          text="Invite"
          {...getLoading('invite')}
          primary
        />
      </div>
    );
  }
  renderHeader() {
    const { organization } = this.props;
    const title = `Manage ${organization.get('name')}`;

    return (
      <div className="orgnization__header">
        <HOCHeaderTitle title={title} subtitle="Invite your team and manage access" />
        <Section title="Manage team" />
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

// const { string } = PropTypes;

Organization.propTypes = {};
