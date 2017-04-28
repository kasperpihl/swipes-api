import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from './actions';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, StatusBar } from 'react-native';
// import AndroidBackButton from 'react-native-android-back-button';
import LinearGradient from 'react-native-linear-gradient';
import Login from './views/login/Login';
import Icon from './components/icons/Icon';
// import DevTools from './components/dev-tools/DevTools';
import HOCTabNavigation from './components/tab-navigation/HOCTabNavigation';
import HOCViewController from './navigation/view-controller/HOCViewController';
import { colors, viewSize } from './utils/globalStyles';
import ActionModal from './modals/ActionModal';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bgColor,
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  bottomBar: {
    width: viewSize.width,
    height: 60,
    backgroundColor: 'green',
  },
  page: {
    width: viewSize.width,
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: viewSize.width,
    height: viewSize.height + 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { initialIndex: 1 };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderLoader() {
    const { isHydrated, lastConnect } = this.props;

    if (isHydrated && lastConnect) {
      return undefined;
    }

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        colors={[colors.bgGradientFrom, colors.bgGradientTo]}
        style={styles.gradient}
      >
        <Icon name="SwipesLogoText" fill={colors.bgColor} width="90" />
      </LinearGradient>
    );
  }
  renderLogin() {
    const { token, isHydrated } = this.props;

    if (token || !isHydrated) {
      return undefined;
    }

    return <Login />;
  }
  renderApp() {
    const { token, isHydrated, lastConnect, activeSliderIndex } = this.props;

    if (!token || !isHydrated || !lastConnect) {
      return undefined;
    }

    return (
      <View style={styles.app}>
        <View style={styles.wrapper}>
          <HOCViewController />
        </View>
        <HOCTabNavigation />
        <ActionModal />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.app}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.20)"
          animated
        />
        {this.renderLoader()}
        {this.renderLogin()}
        {this.renderApp()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.getIn(['connection', 'token']),
    lastConnect: state.getIn(['connection', 'lastConnect']),
    isHydrated: state.getIn(['main', 'isHydrated']),
  };
}

export default connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(App);
