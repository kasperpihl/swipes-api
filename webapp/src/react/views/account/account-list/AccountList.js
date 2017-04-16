import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Icon from 'Icon';
import Button from 'Button';

import './styles/account-list.scss';

class AccountList extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this);
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onLogout = this.onLogout.bind(this);
  }
  componentDidMount() {
  }
  onLogout(e) {
    this.callDelegate('onLogout', e);
  }
  onClick(i, e) {
    const { sections } = this.props;
    this.callDelegate('onClick', sections[i], e);
  }
  renderHeader() {
    return (
      <HOCHeaderTitle title="Account" />
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
    const { isLoggingOut } = this.props;

    return (
      <SWView header={this.renderHeader()}>
        <div className="account-list">
          {this.renderSections()}
        </div>
        <Button
          icon="Logout"
          loading={isLoggingOut}
          className="account-button"
          onClick={this.onLogout}
        />
      </SWView>
    );
  }
}

export default AccountList;

// const { string } = PropTypes;

AccountList.propTypes = {};
