import React, { PureComponent, Fragment } from 'react';
import SplitImage from 'src/react/components/split-image/SplitImage';

class Parent extends PureComponent {
  render() {
    return (
        <SplitImage
          users={['UKCRY3TDG', 'UBPAE5SGS', 'UX2UAZKZW']}
        />
    );
  }
}
export default Parent;

// With images 'URU3EUPOE','USOFI', 'ULNPYMEGU'
// Only initials 'UKCRY3TDG', 'UBPAE5SGS', 'UX2UAZKZW'
