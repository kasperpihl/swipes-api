import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Discuss from './Discuss';

@connect((state) => ({
}), {})
export default class HOCDiscuss extends PureComponent {
  static sizes() {
    return [654];
  }
  render() {
    return (
      <Discuss />
    );
  }
}