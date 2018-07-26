import React, { PureComponent } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';

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
    const { activeSliderIndex, sliders, navPop, sliderChange, infoTab, toggleInfoTab, modal, showModal } = this.props;
    const routeAmount = sliders.getIn([activeSliderIndex, 'routes']).size;

    if (modal) {
      showModal();

      return true;
    }

    if (infoTab.size) {
      toggleInfoTab();

      return true;
    }

    if (routeAmount > 1) {
      navPop(activeSliderIndex);
      return true;
    } else if (routeAmount === 1 && activeSliderIndex !== 2) {
      sliderChange(2);
      return true;
    }

    return false;
  }
  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    activeSliderIndex: state.navigation.get('sliderIndex'),
    sliders: state.navigation.get('sliders'),
    infoTab: state.infoTab,
    modal: state.main.get('modal')
  };
}

export default connect(mapStateToProps, {
  navPop: a.navigation.pop,
  sliderChange: a.navigation.sliderChange,
  toggleInfoTab: a.infotab.showInfoTab,
  showModal: a.main.modal
})(HOCAndroidBackButton);
