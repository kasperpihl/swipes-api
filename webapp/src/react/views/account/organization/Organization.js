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
    this.state = {
      firstName: '',
      email: '',
    };
    this.onInvite = this.onInvite.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
  }
  componentDidMount() {
  }
  onChange(key, val) {
    this.setState({ [key]: val });
  }
  onInvite(e) {
    const { firstName, email } = this.state;
    this.callDelegate('onInvite', firstName, email, e);
  }
  renderUsers() {
    const { users } = this.props;

    const usersHTML = users.map(u => (
      <div className="organization__user" key={u.get('id')}>
        <div className="organization__user-image">
          <HOCAssigning assignees={[u.get('id')]} rounded size={42} />
        </div>
        <div className="organization__user-name">
          {`${u.get('first_name')} ${u.get('last_name')}`}
          <div className="organization__user-status">Pending</div>
        </div>
        <div className="organization__user-email">
          {u.get('email')}
        </div>
        <div className="organization__user-type">
          ADMIN
        </div>
        <div className="organization__user-actions">
          <Button icon="ThreeDots" />
        </div>
      </div>
      )).toArray();

    return (
      <div className="organization__user-list">
        {usersHTML}
      </div>
    );
  }
  renderInvite() {
    const { firstName, email } = this.state;
    return (
      <div className="organization__form">

        <div className="organization__input-wrapper">
          <div className="organization__input">
            <FloatingFormInput id="org-first-name" label="First name" type="text" value={firstName} onChange={this.onChangeCached('firstName')} />
          </div>
          <div className="organization__input">
            <FloatingFormInput id="org-email" label="name@company.com" type="email" value={email} onChange={this.onChangeCached('email')} />
          </div>
        </div>

        <Button
          onClick={this.onInvite}
          text="Invite"
          primary
        />
      </div>
    );
  }
  renderHeader() {
    const { organization } = this.props;
    const title = `Manage ${organization.get('name')}`;

    return <HOCHeaderTitle title={title} subtitle="Invite people in" />;
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <Section title="Manage team">
          <div className="organization">
            {this.renderInvite()}
            {this.renderUsers()}
          </div>
        </Section>
      </SWView>
    );
  }
}

export default Organization;

// const { string } = PropTypes;

Organization.propTypes = {};
