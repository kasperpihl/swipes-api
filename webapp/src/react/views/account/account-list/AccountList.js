import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SWView from 'src/react/app/view-controller/SWView';
import SW from './AccountList.swiss';

class AccountList extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onLogout', 'onClick');
  }
  renderHeader() {
    return (
      <SW.Header>
        <CardHeader
          title={msgGen.users.getFullName('me')}
          subtitle={msgGen.me.getOrg().get('name')}
        />
      </SW.Header>
    );
  }

  renderSections() {
    const { sections } = this.props;

    return sections.map((s, i) => (
      <SW.AccountItem key={i} onClick={this.onClickCached(i)}>
        <SW.CardTitle>
          {s.title}
          <SW.StyledSVG icon="ArrowRightLong" />
        </SW.CardTitle>
        <SW.Description>{s.subtitle}</SW.Description>
      </SW.AccountItem>
    ));
  }
  render() {
    const { getLoading } = this.props;

    return (
      <SWView noframe header={this.renderHeader()}>
        <SW.Wrapper>{this.renderSections()}</SW.Wrapper>
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
