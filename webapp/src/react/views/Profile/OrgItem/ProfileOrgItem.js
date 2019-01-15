import React, { PureComponent } from 'react';
import SW from './ProfileOrgItem.swiss';

export default class ProfileOrgItem extends PureComponent {
  render() {
    const { organization } = this.props;
    return <SW.Wrapper>{organization.get('name')}</SW.Wrapper>;
  }
}
