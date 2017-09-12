import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";
import { setupCachedCallback } from "../../../swipes-core-js/classes/utils";
import * as a from "../../actions";
import HOCActionBar from "./HOCActionBar";
import TabNavigationItem from "./TabNavigationItem";
import { colors, viewSize } from "../../utils/globalStyles";

const styles = StyleSheet.create({
  nav: {
    width: viewSize.width,
    height: 54,
    flexDirection: "row",
    borderTopColor: colors.deepBlue5,
    zIndex: 100,
    backgroundColor: colors.bgColor
  },
  navHidden: {
    width: viewSize.width,
    height: 0,
    flexDirection: "row",
    borderTopColor: colors.deepBlue5,
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
          icon: "Person",
          updateAvailable: false,
        }
      ]
    };

    this.handlePressCached = setupCachedCallback(this.handlePress, this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    this.checkForUpdate(this.props);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillReceiveProps(nextProps) {
    const { rootRoutes } = this.state;
    if (nextProps.counter !== this.props.counter) {
      rootRoutes[0].counter = nextProps.counter;
      this.setState({ rootRoutes });
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
  handlePress(i) {
    const { sliderChange, activeSliderIndex } = this.props;

    if (i !== activeSliderIndex) {
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
    const sliderColor =
      routes.size > 1 ? colors.deepBlue10 : colors.deepBlue100;

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
          fill={colors.deepBlue100}
          key={`navbutton-${i}`}
          delegate={this}
        />
      );
    });

    return navItems;
  }
  renderNavChanger() {

    return (
      <View style={{ width: viewSize.width, height: viewSize.height, position: 'absolute', left: 0, top: 0, backgroundColor: 'red'}}>
        
      </View>
    )
  }
  render() {
    const { routes, actionButtons } = this.props;
    const topBorderStyles = routes.size > 1 ? 0 : 1;
    let navStyles = styles.nav;

    if (routes.size > 1 && !actionButtons.size && Platform.OS === "android") {
      navStyles = styles.navHidden;
    }

    if (actionButtons.get("hide")) {
      return null;
    }

    return (
      <View style={[navStyles, { borderTopWidth: topBorderStyles }]}>
        {this.renderNavItems()}
        {this.renderSlider()}
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
})(HOCTabNavigation);
