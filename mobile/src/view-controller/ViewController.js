import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as views from '../views/';

class ViewController extends Component {
  renderView() {
    const { navId } = this.props;
    const Comp = views[navId];

    return <Comp />;
  }
  render() {
    return this.renderView();
  }
}

export default ViewController;
