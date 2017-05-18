import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import * as a from '../../actions';
import RippleButton from 'react-native-material-ripple';
import Icon from '../icons/Icon';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
    width: viewSize.width / 4,
    height: 4,
    backgroundColor: colors.blue100,
    top: 0,
  },
});


class HOCTabNavigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        {
          icon: 'Milestones',
        },
        {
          icon: 'Goals',
        },
        {
          icon: 'Notification',
        },
        {
          icon: 'Person',
        },
      ],
    };

    this.handlePressCached = setupCachedCallback(this.handlePress, this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  handlePress(i) {
    const { sliderChange, activeSliderIndex } = this.props;

    if (i !== activeSliderIndex) {
      sliderChange(i);
    }
  }
  renderNavItems() {
    const { activeSliderIndex } = this.props;
    const { routes } = this.state;
    const navItems = routes.map((r, i) => {
      const fill = i === activeSliderIndex ? colors.blue100 : colors.deepBlue20;

      return (
        <TouchableHighlight underlayColor="white" activeOpacity="0.7" key={i} onPress={this.handlePressCached(i)}>
          <View style={styles.navItem} >
            <Icon name={r.icon} width="24" height="24" fill={fill} />
          </View>
        </TouchableHighlight>
      );
    });

    return navItems;
  }
  render() {
    const { activeSliderIndex } = this.props;
    const sliderPosPercentage = activeSliderIndex * 25;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;

    return (
      <View style={styles.nav}>
        <View style={[styles.slider, { left: sliderPosPixel }]} />
        {this.renderNavItems()}
      </View >
    );
  }
}

function mapStateToProps(state) {
  return {
    activeSliderIndex: state.getIn(['navigation', 'sliderIndex']),
  };
}

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(HOCTabNavigation);
