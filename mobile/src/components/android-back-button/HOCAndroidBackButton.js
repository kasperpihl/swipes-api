import React, { PureComponent, PropTypes } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import AndroidBackButton from 'react-native-android-back-button';
import * as a from '../../actions';

class HOCAndroidBackButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onBackPress = this.onBackPress.bind(this);
  }
  onBackPress() {
    const { activeSliderIndex, sliders, navPop, sliderChange } = this.props;
    const routeAmount = sliders.getIn([activeSliderIndex, 'routes']).size;

    if (routeAmount > 1) {
      navPop(activeSliderIndex);
      return true;
    } else if (routeAmount === 1 && activeSliderIndex !== 0) {
      sliderChange(0);
      return true;
    }

    return false;
  }
  render() {
    if (Platform === 'android') {
      return <AndroidBackButton onPress={this.onBackPress} />;
    }

    return undefined;
  }
}

const { number, func } = PropTypes;

HOCAndroidBackButton.propTypes = {
  sliders: list,
  activeSliderIndex: number,
  navPop: func,
  sliderChange: func,
};

function mapStateToProps(state) {
  return {
    activeSliderIndex: state.getIn(['navigation', 'sliderIndex']),
    sliders: state.getIn(['navigation', 'sliders']),
  };
}

export default connect(mapStateToProps, {
  navPop: a.navigation.pop,
  sliderChange: a.navigation.sliderChange,
})(HOCAndroidBackButton);
