import React, { PureComponent } from 'react';
import request from 'swipes-core-js/utils/request';
import SW from './ProfileContextMenu.swiss';

export default class ProfileContextMenu extends PureComponent {
  handleLogout = () => {
    request('user.signout');
  };
  render() {
    return (
      <SW.Wrapper>
        <SW.ItemRow onClick={this.handleLogout}>Log out</SW.ItemRow>
      </SW.Wrapper>
    );
  }
}
