import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { setupCachedCallback } from 'react-delegate';
import * as a from 'actions';
import HOCActionBar from './HOCActionBar';
import TabNavigationItem from './TabNavigationItem';
import NavChanger from './NavChanger';
import { colors, viewSize } from 'globalStyles';
import * as gs from 'styles';

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 54,
    flexDirection: 'row',
    backgroundColor: colors.bgColor,
  },
  navHidden: {
    width: viewSize.width,
    height: 0,
    flexDirection: 'row',
    zIndex: 100,
    backgroundColor: colors.bgColor,
  },
  slider: {
    position: 'absolute',
    top: 0,
  },
});

export default @connect((state) => {
  const activeSliderIndex = state.navigation.get('sliderIndex');

  return {
    actionButtons: state.navigation.get('actionButtons'),
    activeSliderIndex,
    routes: state.navigation.getIn(['sliders', activeSliderIndex, 'routes']),
    notificationCounter: state.connection.get('notificationCounter'),
    discussionCounter: state.counter.get('discussion').size,
    versionInfo: state.connection.get('versionInfo'),
  };
}, {
  browser: a.links.browser,
  sliderChange: a.navigation.sliderChange,
})

class HOCTabNavigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNavChanger: false,
      navChangerActive: false,
      rootRoutes: [
        {
          icon: 'Notification',
          counter: props.notificationCounter,
        },
        {
          icon: 'Milestones',
        },
        {
          icon: 'Goals',
        },
        {
          icon: 'Messages',
          counter: props.discussionCounter,
        },
        {
          icon: 'NavSwap',
          updateAvailable: false,
          showMiniSwap: false,
        },
      ],
    };

    this.handlePressCached = setupCachedCallback(this.handlePress, this);
    this.handleNavChange = this.handleNavChange.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    this.checkForUpdate(this.props);
  }
  componentWillUpdate(nextProps, nextState) {
    const { rootRoutes } = this.state;

    LayoutAnimation.easeInEaseOut();

    if (nextProps.notificationCounter !== this.props.notificationCounter) {
      rootRoutes[0].counter = nextProps.notificationCounter;
      this.setState({ rootRoutes });
    }
    if(nextProps.discussionCounter !== this.props.discussionCounter) {
      rootRoutes[3].counter = nextProps.discussionCounter;
      this.setState({ rootRoutes });
    }

    if (nextProps.activeSliderIndex !== this.props.activeSliderIndex && nextProps.activeSliderIndex < 4 && nextState.navChangerActive) {
      rootRoutes[4].icon = 'NavSwap';
      rootRoutes[4].showMiniSwap = false;
      this.setState({ showNavChanger: false, navChangerActive: false, rootRoutes });
    }

    this.checkForUpdate(nextProps);
  }
  checkForUpdate(nextProps) {
    const { versionInfo } = nextProps;
    const { rootRoutes } = this.state;

    if (versionInfo &&
      (versionInfo.get('updateAvailable') ||
        versionInfo.get('reloadRequired') ||
        versionInfo.get('reloadAvailable') ||
        versionInfo.get('updateRequired'))) {
      rootRoutes[4].updateAvailable = true;
      this.setState({ rootRoutes });
    }
  }
  onNavClose() {
    this.setState({ showNavChanger: false, navChangerActive: false });
  }
  onNavChangeAction(type) {
    const { browser } = this.props;

    if (type === 'Update') {
      this.handleNavChange(6, type);
    } else if (type === 'Profile') {
      this.handleNavChange(4, type);
    } else if (type === 'Find') {
      this.handleNavChange(5, type);
    } else if (type === 'QuestionMono') {
      browser('https://support.swipesapp.com/hc/en-us/categories/115000489025-Swipes-Workspace');
      this.setState({ showNavChanger: false, navChangerActive: false });
    } else {
      this.setState({ showNavChanger: false });
    }
  }
  handleNavChange(index, icon) {
    const { sliderChange } = this.props;
    const { rootRoutes } = this.state;

    sliderChange(index);
    rootRoutes[4].icon = icon;
    rootRoutes[4].showMiniSwap = true;
    this.setState({ showNavChanger: false, rootRoutes });
  }
  handlePress(i) {
    const { sliderChange, activeSliderIndex } = this.props;
    const { showNavChanger, navChangerActive, rootRoutes } = this.state;

    if (i !== activeSliderIndex || navChangerActive && parseInt(i) !== 4) {
      if (parseInt(i) === 4) {
        this.setState({ showNavChanger: true, navChangerActive: true });
      } else {
        rootRoutes[4].icon = 'NavSwap';
        rootRoutes[4].showMiniSwap = false;
        this.setState({ showNavChanger: false, navChangerActive: false, rootRoutes });
        sliderChange(i);
      }
    }

    if (parseInt(i) === 4 && showNavChanger) {
      this.setState({ showNavChanger: false, navChangerActive: false });
    }
  }
  renderSlider() {
    const { activeSliderIndex, routes } = this.props;
    const { navChangerActive } = this.state;
    const sliderPosPercentage = navChangerActive ? 4 * 20 : activeSliderIndex * 20;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;
    const sliderPos = routes.size > 1 ? 0 : sliderPosPixel;
    const sliderWidth = routes.size > 1 ? viewSize.width : viewSize.width / 5;
    const sliderHeight = routes.size > 1 ? 1 : 2;
    const sliderColor = routes.size > 1 ? colors.deepBlue10 : colors.deepBlue100;

    return (
      <View
        style={[
          styles.slider,
          {
            left: sliderPos,
            width: sliderWidth,
            height: sliderHeight,
            backgroundColor: sliderColor,
          },
        ]}
      />
    );
  }
  renderNavItems() {
    const { activeSliderIndex, routes } = this.props;
    const { navChangerActive } = this.state;
    const sliderIndex = navChangerActive ? 4 : activeSliderIndex;

    if (routes.size > 1) {
      return <HOCActionBar />;
    }

    const { rootRoutes } = this.state;
    const navItems = rootRoutes.map((r, i) => (
      <TabNavigationItem
        icon={r.icon}
        counter={r.counter}
        index={i}
        key={`navbutton-${i}`}
        delegate={this}
        activeSliderIndex={sliderIndex}
        showMiniSwap={r.showMiniSwap}
        updateAvailable={r.updateAvailable}
      />
    ));

    return navItems;
  }
  renderNavChanger() {
    const { showNavChanger, rootRoutes } = this.state;

    if (!showNavChanger) {
      return undefined;
    }

    return <NavChanger delegate={this} updateAvailable={rootRoutes[4].updateAvailable} />;
  }
  render() {
    const { routes, actionButtons } = this.props;
    let navStyles = styles.nav;

    if (routes.size > 1 && !actionButtons.size && Platform.OS === 'android') {
      navStyles = styles.navHidden;
    }

    if (actionButtons.get('hide')) {
      return null;
    }

    return (
      <View>
        <View style={navStyles}>
          {this.renderSlider()}
          {this.renderNavItems()}
        </View>
        {this.renderNavChanger()}
      </View>
    );
  }
}
