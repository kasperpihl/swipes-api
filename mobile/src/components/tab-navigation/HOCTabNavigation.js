import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import * as a from '../../actions';
import Icon from '../icons/Icon';
import RippleButton from '../ripple-button/RippleButton';
import HOCActionBar from './HOCActionBar';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 70,
    flexDirection: 'row',
    borderTopColor: colors.deepBlue5,
    zIndex: 100,
    backgroundColor: colors.bgColor,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
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
  renderSlider() {
    const { activeSliderIndex, actionButtons } = this.props;
    const sliderPosPercentage = activeSliderIndex * 25;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;
    const sliderPos = actionButtons.size ? 0 : sliderPosPixel;
    const sliderWidth = actionButtons.size ? viewSize.width : viewSize.width / 4;
    const sliderHeight = actionButtons.size ? 2 : 4;
    const sliderColor = actionButtons.size ? colors.blue100 : colors.blue100;


    return (
      <View style={[styles.slider, { left: sliderPos, width: sliderWidth, height: sliderHeight, backgroundColor: sliderColor }]} />
    );
  }
  renderNavItems() {
    const { activeSliderIndex, actionButtons } = this.props;

    if (actionButtons.size) {
      return <HOCActionBar />;
    }

    const { routes } = this.state;
    const navItems = routes.map((r, i) => {
      const fill = i === activeSliderIndex ? colors.blue100 : colors.deepBlue20;

      return (
        <RippleButton rippleColor={colors.blue100} rippleOpacity={0.8} style={styles.navItem} key={`navbutton-${i}`} onPress={this.handlePressCached(i)}>
          <View style={styles.navItem}>
            <Icon name={r.icon} width="24" height="24" fill={fill} />
          </View>
        </RippleButton>
      );
    });

    return navItems;
  }
  render() {
    const { actionButtons } = this.props;
    const topBorderStyles = actionButtons.size ? 0 : 1;

    return (
      <View style={[styles.nav, { borderTopWidth: topBorderStyles }]}>
        {this.renderNavItems()}
        {this.renderSlider()}
      </View >
    );
  }
}

function mapStateToProps(state) {
  return {
    actionButtons: state.getIn(['navigation', 'actionButtons']),
    activeSliderIndex: state.getIn(['navigation', 'sliderIndex']),
  };
}

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(HOCTabNavigation);
