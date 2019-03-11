import React, { Component } from 'react';

export default class Tester extends Component {
  render() {
    console.log(this.props);
    return <div style={{ width: '100%' }} />;
  }
}
