import React, { Component, PropTypes } from 'react'
import {
  NavigationExperimental,
  View,
  StyleSheet,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

class Navigator extends Component {
  constructor(props, context) {
    super(props, context);

    this.onPushRoute = props.onNavigationChange.bind(null, 'push');
    this.onPopRoute = props.onNavigationChange.bind(null, 'pop');
    this.renderScene = this.renderScene.bind(this);
  }
  renderScene(sceneProps) {
    const actions = {
      onPushRoute: this.onPushRoute,
      onPopRoute: this.onPopRoute
    }

    return React.createElement(sceneProps.scene.route.component,
      {
        ...sceneProps.scene.route.props,
        ...actions,
        sceneProps
      }
    )
  }
  render() {
    return (
      <NavigationCardStack
        onNavigateBack={this.onPopRoute}
        navigationState={this.props.navigationState}
        renderScene={this.renderScene}
      />
    );
  }
}

export default Navigator