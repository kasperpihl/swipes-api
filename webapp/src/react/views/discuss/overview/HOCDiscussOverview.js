import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DiscussOverview from './DiscussOverview';

@connect((state) => ({
}), {})
export default class extends PureComponent {
  static sizes() {
    return [654];
  }
  render() {
    return (
      <DiscussOverview />
    );
  }
}