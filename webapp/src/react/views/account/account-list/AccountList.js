import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import SW from './AccountList.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const AccountButton = styleElement(Button, styles.AccountButton);
const AccountItem = styleElement('div', styles.AccountItem);
const Header = styleElement('div', styles.Header);
const CardTitle = styleElement('div', styles.CardTitle);
const Description = styleElement('div', styles.Description);
const StyledSVG = styleElement(Icon, styles.StyledSVG);

class AccountList extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onLogout', 'onClick');
  }
  renderHeader() {
    return (
      <SW.Header>
        <HOCHeaderTitle title={msgGen.users.getFullName('me')} subtitle={msgGen.me.getOrg().get('name')}/>
      </SW.Header>
    );
  }

  renderSections() {
    const { sections } = this.props;

    return sections.map((s, i) => (
      <SW.AccountItem key={i} onClick={this.onClickCached(i)}>
        <SW.CardTitle>
          {s.title}
          <SW.StyledSVG icon="ArrowRightLong"/>
        </SW.CardTitle>
        <SW.Description>{s.subtitle}</SW.Description>
      </SW.AccountItem>
    ));
  }
  render() {
    const { getLoading } = this.props;

    return (
      <SWView noframe header={this.renderHeader()}>
        <SW.Wrapper>
          {this.renderSections()}
        </SW.Wrapper>
        <SW.AccountButton
          icon="Logout"
          {...getLoading('logout')}
          onClick={this.onLogout}
        />
      </SWView>
    );
  }
}

export default AccountList;
