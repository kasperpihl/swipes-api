import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import * as a from '../../actions';
import HOCActionBar from './HOCActionBar';
import TabNavigationItem from './TabNavigationItem';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 54,
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
          icon: 'Goals',
        },
        {
          icon: 'Milestones',
        },
        {
          icon: 'Notification',
        },
        {
          icon: 'Messages',
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
      if (!i) {
        sliderChange(0);
        return;
      }

      sliderChange(i);
    }
  }
  renderSlider() {
    const { activeSliderIndex, routes } = this.props;
    const sliderPosPercentage = activeSliderIndex * 20;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;
    const sliderPos = routes.size > 1 ? 0 : sliderPosPixel;
    const sliderWidth = routes.size > 1 ? viewSize.width : viewSize.width / 5;
    const sliderHeight = routes.size > 1 ? 1 : 2;
    const sliderColor = routes.size > 1 ? colors.deepBlue10 : colors.deepBlue100;

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
      return <TabNavigationItem icon={r.icon} index={i} fill={colors.deepBlue100} key={`navbutton-${i}`} delegate={this} />;
    });

    return navItems;
  }
  render() {
    const { routes, actionButtons } = this.props;
    const topBorderStyles = routes.size > 1 ? 0 : 1;
    let navStyles = styles.nav;

    if (routes.size > 1 && !actionButtons.size && Platform.OS === 'android') {
      navStyles = styles.navHidden;
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
