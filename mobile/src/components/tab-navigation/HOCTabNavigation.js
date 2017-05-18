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
      indexx: 0,
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
    // const { sliderChange, activeSliderIndex } = this.props;
    const { indexx } = this.state;

    if (i !== indexx) {
      // sliderChange(i);
      this.setState({ indexx: 0 });
    }
  }
  renderNavItems() {
    // const { activeSliderIndex } = this.props;
    const { routes, indexx } = this.state;
    const navItems = routes.map((r, i) => {
      const fill = i === indexx ? colors.blue100 : colors.deepBlue20;

      return (
        <RippleButton rippleColor={colors.blue100} rippleOpacity={0.7} style={styles.navItem} key={i} onPressIn={this.handlePressCached(i)}>
          <View style={styles.navItem}>
            <Icon name={r.icon} width="24" height="24" fill={fill} />
          </View>
        </RippleButton>
      );
    });

    return navItems;
  }
  render() {
    // const { activeSliderIndex } = this.props;
    const { indexx } = this.state;
    const sliderPosPercentage = indexx * 25;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;

    return (
      <View style={styles.nav}>
        {this.renderNavItems()}
        <View style={[styles.slider, { left: sliderPosPixel }]} />
      </View >
    );
  }
}

function mapStateToProps(state) {
  return {
    // activeSliderIndex: state.getIn(['navigation', 'sliderIndex']),
  };
}

export default connect(mapStateToProps, {
  // sliderChange: a.navigation.sliderChange,
})(HOCTabNavigation);
