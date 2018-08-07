import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { setupCachedCallback } from 'react-delegate';
import throttle from 'swipes-core-js/utils/throttle';
import * as views from 'views';
import { viewSize } from 'globalStyles';

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

class SceneRenderer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.navPushCached = setupCachedCallback(throttle(props.navPush, 350, true));
    this.navPopCached = setupCachedCallback(throttle(props.navPop, 350, true));
  }
  render() {
    const { activeSliderIndex, routes, setActionButtons, route, navPush, isActive } = this.props;

    // ROUTES ARE DEFINED IN src/views/index.js FILE
    // thanks for hiding this in 10000 abstractions to make life simpler
    const Comp = views[route.id];
    const sliderIndex = `${activeSliderIndex}`;

    return (
      <View style={styles.viewController} key={activeSliderIndex}>
        <View style={styles.content}>
          <Comp
            navPush={this.navPushCached(sliderIndex)}
            navPop={this.navPopCached(activeSliderIndex)}
            setActionButtons={setActionButtons}
            isActive={isActive}
            {...route.props}
          />
        </View>
      </View>
    );
  }
}

export default SceneRenderer;
