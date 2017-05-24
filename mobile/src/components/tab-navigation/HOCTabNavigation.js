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
  navHidden: {
    width: viewSize.width,
    height: 0,
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
      rootRoutes: [
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
    const { activeSliderIndex, routes } = this.props;
    const sliderPosPercentage = activeSliderIndex * 25;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;
    const sliderPos = routes.size > 1 ? 0 : sliderPosPixel;
    const sliderWidth = routes.size > 1 ? viewSize.width : viewSize.width / 4;
    const sliderHeight = routes.size > 1 ? 2 : 4;
    const sliderColor = routes.size > 1 ? colors.blue100 : colors.blue100;


    return (
      <View style={[styles.slider, { left: sliderPos, width: sliderWidth, height: sliderHeight, backgroundColor: sliderColor }]} />
    );
  }
  renderNavItems() {
    const { activeSliderIndex, routes } = this.props;

    if (routes.size > 1) {
      return <HOCActionBar />;
    }

    const { rootRoutes } = this.state;
    const navItems = rootRoutes.map((r, i) => {
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
    const { routes, actionButtons } = this.props;
    const topBorderStyles = routes.size > 1 ? 0 : 1;
    let navStyles = styles.nav;

    if (routes.size > 1 && !actionButtons.size && Platform.OS === 'android') {
      // navStyles = styles.navHidden;
    }

    return (
      <View style={[navStyles, { borderTopWidth: topBorderStyles }]}>
        {this.renderNavItems()}
        {this.renderSlider()}
      </View >
    );
  }
}

function mapStateToProps(state) {
  const activeSliderIndex = state.getIn(['navigation', 'sliderIndex']);

  return {
    actionButtons: state.getIn(['navigation', 'actionButtons']),
    activeSliderIndex,
    routes: state.getIn(['navigation', 'sliders', activeSliderIndex, 'routes']),
  };
}

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(HOCTabNavigation);
