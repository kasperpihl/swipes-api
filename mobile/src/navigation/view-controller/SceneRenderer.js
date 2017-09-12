import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import * as views from '../../views';
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

    this.navPushCached = setupCachedCallback(props.navPush);
    this.navPopCached = setupCachedCallback(props.navPop);
  }
  render() {
    const { activeSliderIndex, routes, setActionButtons, route, navPush, isActive } = this.props;
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
