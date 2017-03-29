import React, { PureComponent } from 'react'
import { View, NavigationExperimental, StyleSheet } from 'react-native';
import Navigator from './Navigator';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
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
  onNavigationChange(type, view) {
    let { navigationState } = this.state;

    switch (type) {
      case 'push':
        const route = {
          key: view.key,
          title: view.title,
          component: view.component,
          props: view.props
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
    console.log(this.props)
    return (
      <Navigator
        navigationState={this.state.navigationState}
        onNavigationChange={this.onNavigationChange}
      />
    )
  }
}

export default StackNavigator