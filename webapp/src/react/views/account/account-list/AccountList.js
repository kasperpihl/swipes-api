import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';
import styles from './styles/AccountList.swiss';

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
      <Header>
        <HOCHeaderTitle title={msgGen.users.getFullName('me')} subtitle={msgGen.me.getOrg().get('name')}/>
      </Header>
    );
  }

  renderSections() {
    const { sections } = this.props;

    return sections.map((s, i) => (
      <AccountItem key={i} onClick={this.onClickCached(i)} className='accountItem'>
        <CardTitle>
          {s.title}
          <StyledSVG icon="ArrowRightLong"/>
        </CardTitle>
        <Description>{s.subtitle}</Description>
      </AccountItem>
    ));
  }
  render() {
    const { getLoading } = this.props;

    return (
      <SWView noframe header={this.renderHeader()}>
        <Wrapper>
          {this.renderSections()}
        </Wrapper>
        <AccountButton
          icon="Logout"
          {...getLoading('logout')}
          onClick={this.onLogout}
        />
      </SWView>
    );
  }
}

export default AccountList;
