import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, StatusBar } from 'react-native';
import OneSignal from 'react-native-onesignal';
import LinearGradient from 'react-native-linear-gradient';
import Login from './views/login/Login';
import Icon from './components/icons/Icon';
import HOCTabNavigation from './components/tab-navigation/HOCTabNavigation';
import HOCAndroidBackButton from './components/android-back-button/HOCAndroidBackButton';
import HOCViewController from './navigation/view-controller/HOCViewController';
import { colors, viewSize } from './utils/globalStyles';
import LoadingModal from './modals/LoadingModal';

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
    this.onIds = this.onIds.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentDidMount() {
    this.checkTagsAndUpdate();
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.myId !== this.props.myId) {
      this.checkTagsAndUpdate();
    }
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }
  onIds(device) {
    if (device.userId) {
      this.playerId = device.userId;
      this.checkTagsAndUpdate();
    }
    // console.log('Device info: ', device);
  }
  checkTagsAndUpdate() {
    const { myId } = this.props;
    OneSignal.getTags((receivedTags) => {
      if (!receivedTags) {
        receivedTags = {};
      }
      if ((!receivedTags.swipesUserId && myId) || myId !== receivedTags.swipesUserId) {
        // console.log('sending tag', myId);
        OneSignal.sendTag('swipesUserId', myId || '');
      }
      // console.log(receivedTags);
    });
    if (myId) {

    }
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
  renderBackButton() {
    if (Platform.OS === 'android') {
      return <HOCAndroidBackButton />;
    }

    return undefined;
  }
  renderApp() {
    const { token, isHydrated, lastConnect } = this.props;

    if (!token || !isHydrated || !lastConnect) {
      return undefined;
    }

    return (
      <View style={styles.app}>
        <View style={styles.wrapper}>
          <HOCViewController />
        </View>
        <LoadingModal />
        <HOCTabNavigation />
        {this.renderBackButton()}
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
    myId: state.getIn(['me', 'id']),
    lastConnect: state.getIn(['connection', 'lastConnect']),
    isHydrated: state.getIn(['main', 'isHydrated']),
  };
}

export default connect(mapStateToProps, {
})(App);
