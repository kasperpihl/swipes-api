import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";
import { setupCachedCallback } from "swipes-core-js/classes/utils";
import * as a from "actions";
import HOCActionBar from "./HOCActionBar";
import TabNavigationItem from "./TabNavigationItem";
import NavChanger from "./NavChanger";
import { colors, viewSize } from "globalStyles";

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 54,
    flexDirection: "row",
    zIndex: 100,
    backgroundColor: colors.bgColor
  },
  navHidden: {
    width: viewSize.width,
    height: 0,
    flexDirection: "row",
    zIndex: 100,
    backgroundColor: colors.bgColor
  },
  slider: {
    position: "absolute",
    top: 0
  }
});

class HOCTabNavigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNavChanger: false,
      navChangerActive: false,
      rootRoutes: [
        {
          icon: "Notification",
          counter: props.counter,
        },
        {
          icon: "Milestones"
        },
        {
          icon: "Goals"
        },
        {
          icon: "Messages"
        },
        {
          icon: "NavSwap",
          updateAvailable: false,
          showMiniSwap: false,
        }
      ]
    };

    this.handlePressCached = setupCachedCallback(this.handlePress, this);
    this.handleNavChange = this.handleNavChange.bind(this);

    if (Platform.OS === "android") {
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

    if (nextProps.counter !== this.props.counter) {
      rootRoutes[0].counter = nextProps.counter;
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
  onNavChangeAction(type) {
    const { sliderChange, navPush } = this.props;
    const { rootRoutes } = this.state;

    if (type === 'Update') {
      this.handleNavChange(6, type);
    } else if (type === 'Profile') {
      this.handleNavChange(4, type);
    } else if (type === 'Find') {
      this.handleNavChange(5, type);
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
      this.setState({ showNavChanger: false, navChangerActive: false })
    }
  }
  renderSlider() {
    const { activeSliderIndex, routes } = this.props;
    const { navChangerActive } = this.state;
    const sliderPosPercentage =  navChangerActive ? 4 * 20 : activeSliderIndex * 20;
    const sliderPosPixel = sliderPosPercentage * viewSize.width / 100;
    const sliderPos = routes.size > 1 ? 0 : sliderPosPixel;
    const sliderWidth = routes.size > 1 ? viewSize.width : viewSize.width / 5;
    const sliderHeight = routes.size > 1 ? 1 : 54;
    const sliderColor = routes.size > 1 ? colors.deepBlue10 : colors.deepBlue5;

    return (
      <View
        style={[
          styles.slider,
          {
            left: sliderPos,
            width: sliderWidth,
            height: sliderHeight,
            backgroundColor: sliderColor
          }
        ]}
      />
    );
  }
  renderNavItems() {
    const { activeSliderIndex, routes } = this.props;
    const { navChangerActive } = this.state;
    const sliderIndex = navChangerActive ? navChangerActive : activeSliderIndex

    if (routes.size > 1) {
      return <HOCActionBar />;
    }

    const { rootRoutes } = this.state;
    const navItems = rootRoutes.map((r, i) => {
      return (
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
      );
    });

    return navItems;
  }
  renderNavChanger() {
    const { showNavChanger } = this.state;

    if (!showNavChanger) {
      return undefined;
    }
    
    return <NavChanger delegate={this} />
  }
  render() {
    const { routes, actionButtons } = this.props;
    let navStyles = styles.nav;

    if (routes.size > 1 && !actionButtons.size && Platform.OS === "android") {
      navStyles = styles.navHidden;
    }

    if (actionButtons.get("hide")) {
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

function mapStateToProps(state) {
  const activeSliderIndex = state.getIn(["navigation", "sliderIndex"]);

  return {
    actionButtons: state.getIn(["navigation", "actionButtons"]),
    activeSliderIndex,
    routes: state.getIn(["navigation", "sliders", activeSliderIndex, "routes"]),
    counter: state.getIn(['connection', 'notificationCounter']),
    versionInfo: state.getIn(['connection', 'versionInfo']),
  };
}

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
  navPush: a.navigation.push
})(HOCTabNavigation);
