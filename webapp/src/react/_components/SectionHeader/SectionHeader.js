import React, { PureComponent } from 'react';
import SW from './SectionHeader.swiss';

export default class SectionHeader extends PureComponent {
  render() {
    const { children } = this.props;
    return <SW.Wrapper>{children}</SW.Wrapper>;
  }
}
