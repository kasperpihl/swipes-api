import React, { Component } from 'react';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
export default class Tester extends Component {
  render() {
    const subtitle = {
      ownedBy: 'UT5UFVX2I',
      members: ['me'],
      privacy: 'public'
    };
    return (
      <div>
        <CardHeader title="test" subtitle={subtitle} separator />
      </div>
    );
  }
}
