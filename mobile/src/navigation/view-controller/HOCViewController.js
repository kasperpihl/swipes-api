import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Platform, Keyboard } from 'react-native';
import NavigationExperimental from 'react-native-navigation-experimental-compat';
import * as a from '../../actions';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import SceneRenderer from './SceneRenderer';
import { viewSize } from '../../utils/globalStyles';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

const styles = StyleSheet.create({
  viewController: {
    width: viewSize.width,
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});


class HOCViewController extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.renderScene = this.renderScene.bind(this);
    this.navPopCached = setupCachedCallback(props.navPop);
  }
  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps);
    return Keyboard.dismiss;
  }
  reduxToNavigationState(reduxState) {
    return {
      index: reduxState.size - 1,
      routes: reduxState.map((r, i) => r.set('key', `${i}`).toObject()).toArray(),
    };
  }
  renderScene(sceneProps) {
    const { route } = sceneProps.scene;
    const { activeSliderIndex, routes, setActionButtons, navPop, navPush } = this.props;

    return (
      <SceneRenderer
        route={route}
        activeSliderIndex={activeSliderIndex}
        routes={routes}
        setActionButtons={setActionButtons}
        navPush={navPush}
        navPop={navPop}
        isActive={sceneProps.scene.isActive}
      />
    );
  }
  render() {
    const { activeSliderIndex, routes } = this.props;

    return (
      <NavigationCardStack
        style={styles.viewController}
        enableGestures={Platform.OS === 'ios'}
        onNavigateBack={this.navPopCached(activeSliderIndex)}
        navigationState={this.reduxToNavigationState(routes)}
        renderScene={this.renderScene}
      />
    );
  }
}

function mapStateToProps(state) {
  const activeSliderIndex = state.getIn(['navigation', 'sliderIndex']);

  return {
    activeSliderIndex,
    routes: state.getIn(['navigation', 'sliders', activeSliderIndex, 'routes']),
  };
}

export default connect(mapStateToProps, {
  navPush: a.navigation.push,
  navPop: a.navigation.pop,
  setActionButtons: a.navigation.setActionButtons,
})(HOCViewController);
