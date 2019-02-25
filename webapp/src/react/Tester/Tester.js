import React, { Component } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import Button from '../_components/Button/Button';
export default class Tester extends Component {
  render() {
    const subtitle = {
      ownedBy: 'UT5UFVX2I',
      members: ['me'],
      privacy: 'public'
    };
    return (
      <div style={{ width: '100%' }}>
        <CardHeader title="test" separator>
          <Button icon="Messages" title="Test" />
          <Button icon="ThreeDots" />
        </CardHeader>
      </div>
    );
  }
}
