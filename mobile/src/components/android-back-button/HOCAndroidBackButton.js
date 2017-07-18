import React, { PureComponent, PropTypes } from 'react';
import { BackHandler } from 'react-native';
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
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
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
    return null;
  }
}

const { string, func } = PropTypes;

HOCAndroidBackButton.propTypes = {
  sliders: list,
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
