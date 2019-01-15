import React, { PureComponent } from 'react';
import AccountHeader from './Header/AccountHeader';
import Button from 'src/react/components/button/Button';
import SWView from 'src/react/app/view-controller/SWView';

export default class extends PureComponent {
  handleLogout = () => {};
  renderHeader = () => <AccountHeader />;
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <Button title="Log out" onClick={this.handleLogout} />
      </SWView>
    );
  }
}
