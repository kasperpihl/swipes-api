import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';

import './styles/account-list.scss';

class AccountList extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onLogout', 'onClick');
  }
  renderHeader() {
    return (
      <div className="account-list__header">
        <HOCHeaderTitle title={msgGen.users.getFullName('me')} subtitle={msgGen.me.getOrg().get('name')}/>
      </div>
    );
  }
  renderSections() {
    const { sections } = this.props;

    return sections.map((s, i) => (
      <div className="account-item" key={i} onClick={this.onClickCached(i)}>
        <div className="account-item__title">
          {s.title}
          <Icon icon="ArrowRightLong" className="account-item__svg" />
        </div>
        <div className="account-item__description">{s.subtitle}</div>
      </div>
    ));
  }
  render() {
    const { getLoading } = this.props;

    return (
      <SWView noframe header={this.renderHeader()}>
        <div className="account-list">
          {this.renderSections()}
        </div>
        <Button
          icon="Logout"
          {...getLoading('logout')}
          className="account-button"
          onClick={this.onLogout}
        />
      </SWView>
    );
  }
}

export default AccountList;
