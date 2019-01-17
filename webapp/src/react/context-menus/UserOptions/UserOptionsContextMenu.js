import React, { PureComponent } from 'react';
import SW from './UserOptionsContextMenu.swiss';

export default class UserOptionsContextMenu extends PureComponent {
  render() {
    return (
      <SW.Wrapper>
        <SW.ItemRow>Promote to admin</SW.ItemRow>
        <SW.ItemRow>Demote admin to user</SW.ItemRow>
        <SW.ItemRow>Transfer ownership</SW.ItemRow>
        <SW.ItemRow>Enable account</SW.ItemRow>
        <SW.ItemRow>Disable account</SW.ItemRow>
      </SW.Wrapper>
    );
  }
}
