import React, { PureComponent } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import Interactable from 'react-native-interactable';
import { styles } from './styles/sliderNavStyles';

const { width: ww } = Dimensions.get('window');

const BOUNDARY = 60;

const SCALE_TRANS = [1, .92];
const SCALE_THRESHOLD = 60;
const BORDERRADIUS_TRANS = [0, 6];
const BORDERRADIUS_THRESHOLD = 5;
const OPACITY_TRANS = [1, 0];
const OPACITY_THRESHOLD = 2;

class SliderNav extends PureComponent {
  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
  }
  getSnapPoints() {
    const { children } = this.props;

    const snapPoints = children.map((c, i) => {
      return {
        x: ww * i * -1,
        tension: 5000,
        damping: 0
      }
    });

    return snapPoints
  }
  getGravityPoints() {
    const { children } = this.props;

    const gravityPoints = children.map((c, i) => {
      return {
        x: ww * i * -1,
        y: 0,
        strength: 0,
        falloff: ww / 2.5,
        damping: .4,
        haptics: true
      }
    });

    return gravityPoints
  }
  getInitialPosition() {
    const { children, initialPosition } = this.props;

    if (!initialPosition) {
      return {
        x: 0,
        y: 0
      }
    }

    let pos = {};

    children.forEach((c, i) => {
      if (i === initialPosition) {
        pos = {
          x: ww * i * -1,
          y: 0
        }
      }
    });

    return pos;
  }
  getInterpolation(i, params) {
    const { children } = this.props;
    const { fromValue, toValue, threshold } = params;
    let inputRange = [];
    let outputRange = [];

    children.forEach((c, i) => {
      const runningX = - (i * ww);

      if (i > 0) {
        inputRange.push(runningX + threshold)
        outputRange.push(toValue);
      }

      inputRange.push(runningX);
      outputRange.push(fromValue);

      if (i < (children.length - 1)) {
        inputRange.push(runningX - threshold);
        outputRange.push(toValue);
      }
    })

    inputRange.reverse();
    outputRange.reverse();

    return {
      inputRange: inputRange,
      outputRange: outputRange
    }
  }
  renderViews() {
    const { children } = this.props;

    const viewComponents = children.map((component, i) => {

      const transformInterpolate = (this.getInterpolation(i, {
        fromValue: SCALE_TRANS[0],
        toValue: SCALE_TRANS[1],
        threshold: SCALE_THRESHOLD,
      }));

      const borderRadiusInterpolate = (this.getInterpolation(i, {
        fromValue: BORDERRADIUS_TRANS[0],
        toValue: BORDERRADIUS_TRANS[1],
        threshold: BORDERRADIUS_THRESHOLD,
      }));

      return (
        <Animated.View
          key={`view-${i}`}
          style={[ styles.view,
            {
              transform: [{ scale: this._deltaX.interpolate(transformInterpolate) }],
              borderRadius: this._deltaX.interpolate(borderRadiusInterpolate)
            },
          ]}
        >
          {component}
        </Animated.View>
      )
    });

    return viewComponents;
  }
  render() {
    const { children } = this.props;

    return (
      <Interactable.View
        style={[styles.container, { width: ww * children.length}]}
        horizontalOnly={true}
        snapPoints={this.getSnapPoints()}
        gravityPoints={this.getGravityPoints()}
        initialPosition={this.getInitialPosition()}
        boundaries={{
          left: ((ww * (children.length - 1)) * -1) - BOUNDARY,
          right: BOUNDARY,
          top: 0,
          bottom: 0,
          bounce: 0,
          haptics: true
        }}
        dragToss={0}
        animatedValueX={this._deltaX}
      >
        {this.renderViews()}
      </Interactable.View>
    );
  }
}

export default SliderNav;
