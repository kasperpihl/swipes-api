import React, { PureComponent, PropTypes } from 'react'
import { View, NavigationExperimental, StyleSheet } from 'react-native';
import Navigator from './Navigator';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

class StackNavigator extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      navigationState: {
        index: 0,
        routes: [
          {
            key: props.scene.key,
            title: props.scene.title,
            component: props.scene.component
          }
        ],
      },
    }
    this.onNavigationChange = this.onNavigationChange.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      return true
    }

    return false;
  }
  onNavigationChange(type, view) {
    let { navigationState } = this.state;

    switch (type) {
      case 'push':
        const route = {
          key: view.key,
          title: view.title,
          component: view.component
        };

        navigationState = NavigationStateUtils.push(navigationState, route);
        break;
      case 'pop':
        navigationState = NavigationStateUtils.pop(navigationState);
        break;
    }

    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  }
  render() {
    return (
      <Navigator
        navigationState={this.state.navigationState}
        onNavigationChange={this.onNavigationChange}
      />
    )
  }
}

export default StackNavigator