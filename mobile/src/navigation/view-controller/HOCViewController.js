import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavigationExperimental, View, StyleSheet, Platform } from 'react-native';
import * as a from '../../actions';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import * as views from '../../views';
import HOCBreadCrumbs from '../../components/breadcrumbs/HOCBreadCrumbs';
import { viewSize } from '../../utils/globalStyles';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

const styles = StyleSheet.create({
  viewController: {
    width: viewSize.width,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});


class HOCViewController extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.renderScene = this.renderScene.bind(this);
    this.navPushCached = setupCachedCallback(props.navPush);
    this.navPopCached = setupCachedCallback(props.navPop);
  }
  componentWillUpdate(nextProps, nextState) {

  }
  reduxToNavigationState(reduxState) {
    return {
      index: reduxState.size - 1,
      routes: reduxState.map((r, i) => r.set('key', `${i}`).toObject()).toArray(),
    };
  }
  renderScene(sceneProps) {
    const { route } = sceneProps.scene;
    const { activeSliderIndex, routes, setActionButtons } = this.props;
    const Comp = views[route.id];

    return (
      <View style={styles.viewController}>
        <HOCBreadCrumbs sliderIndex={activeSliderIndex} />
        <View style={styles.content}>
          <Comp
            navPush={this.navPushCached(activeSliderIndex)}
            navPop={this.navPopCached(activeSliderIndex)}
            setActionButtons={setActionButtons}
            {...route.props}
          />
        </View>
      </View>
    );
  }
  render() {
    const { activeSliderIndex, routes } = this.props;

    return (
      <NavigationCardStack
        style={styles.viewController}
        enableGestures={Platform === 'ios'}
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
})(HOCViewController);
