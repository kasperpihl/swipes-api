import React, { PureComponent } from 'react';
import AccountHeader from './Header/AccountHeader';
import Button from 'src/react/components/button/Button';

export default class extends PureComponent {
  render() {
    return (
      <>
        <AccountHeader />
        <Button title="Log out" />
      </>
    );
  }
}
