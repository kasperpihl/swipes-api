import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import HOCLoginFlow from 'views/login-flow/HOCLoginFlow';
import HOCInfoTab from 'views/info-tab/HOCInfoTab';
import HOCNoOrg from 'views/no-org/HOCNoOrg';
import Icon from 'components/icons/Icon';
import HOCTabNavigation from 'components/tab-navigation/HOCTabNavigation';
import HOCAndroidBackButton from 'components/android-back-button/HOCAndroidBackButton';
import { colors, viewSize } from 'utils/globalStyles';
import * as gs from 'styles';
import HOCConnectionBar from 'components/connection-bar/HOCConnectionBar';
import * as a from 'actions';
import HOCModal from 'components/modal/HOCModal';
import HOCLoading from 'components/loading/HOCLoading';
import getGlobals from 'utils/globals';
import HOCViewController from './navigation/view-controller/HOCViewController';

const styles = StyleSheet.create({
  app: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('column'),
    backgroundColor: gs.colors.bgColor,
  },
  wrapper: {
    ...gs.mixins.size(1),
    backgroundColor: colors.bgColor,
  },
  gradient: {
    ...gs.mixins.size(viewSize.width, viewSize.height + 24),
    ...gs.mixins.flex('center'),
    position: 'absolute',
    left: 0,
    top: 0,
  },
});


class App extends PureComponent {
  constructor(props) {
    super(props);

    this.onIds = this.onIds.bind(this);
    this.onOpened = this.onOpened.bind(this);
  }
  componentWillMount() {
    // Temp fix for Android
    // Fix for next release - make it as in documentation for ios and android
    if (Platform.OS === 'android') {
      let key = '420ca44f-378a-4ce5-adb7-18cef4b689c0';

      if (getGlobals().isDev) {
        key = 'db8f2558-a836-4e95-b22b-089e8e85f6e9';
      }

      OneSignal.init(key);
    }

    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.inFocusDisplaying(2);
  }
  componentDidMount() {
    // this.checkTagsAndUpdate();
  }
  componentDidUpdate(prevProps) {
    if (this.props.ready && this.forwardToIndex) {
      setTimeout(() => {
        this.props.sliderChange(this.forwardToIndex);
        this.forwardToIndex = undefined;
      }, 1);
    }

    if (prevProps.myId !== this.props.myId) {
      this.checkTagsAndUpdate();
    }
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.removeEventListener('opened', this.onOpened);
  }
  onIds(device) {
    if (device.userId) {
      this.playerId = device.userId;
      this.checkTagsAndUpdate();
    }
    // console.log('Device info: ', device);
  }
  onOpened() {
    const { ready, sliderChange } = this.props;
    if (ready) {
      sliderChange(0);
    } else {
      this.forwardToIndex = 0;
    }
  }
  checkTagsAndUpdate() {
    OneSignal.getTags((receivedTags) => {
      const { myId, isHydrated } = this.props;
      if (!receivedTags) {
        receivedTags = {};
      }
      if (isHydrated && !myId && receivedTags.swipesUserId) {
        OneSignal.deleteTag('swipesUserId');
      } else if (isHydrated && myId && !receivedTags.swipesUserId) {
        OneSignal.sendTag('swipesUserId', myId);
      }
    });
  }
  renderLoader() {
    const { isHydrated, hasConnected, status } = this.props;
    if (!isHydrated || (!hasConnected && status === 'connecting')) {
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.5 }}
          colors={[colors.bgGradientFrom, colors.bgGradientTo]}
          style={styles.gradient}
        >
          <Icon icon="SwipesLogoText" fill={colors.bgColor} width="90" />
        </LinearGradient>
      );
    }
    return undefined;
  }
  renderLogin() {
    const { token, isHydrated } = this.props;

    if (token || !isHydrated) {
      return undefined;
    }

    return <HOCLoginFlow />;
  }
  renderBackButton() {
    if (Platform.OS === 'android') {
      return <HOCAndroidBackButton />;
    }

    return undefined;
  }
  renderKeyboardSpacer() {
    if (Platform.OS === 'ios') {
      return <KeyboardSpacer />;
    }

    return undefined;
  }
  renderNoOrg() {
    const { token, readyInOrg, isHydrated, hasConnected, status } = this.props;

    if (!isHydrated || !token || !hasConnected || readyInOrg) {
      return undefined;
    }

    return <HOCNoOrg />;
  }
  renderApp() {
    const { token, readyInOrg, isHydrated } = this.props;

    if (!isHydrated || !token || !readyInOrg) {
      return undefined;
    }

    return (
      <View style={styles.app}>
        <HOCConnectionBar />
        <View style={styles.wrapper}>
          <HOCViewController />
        </View>
        <HOCInfoTab />
        <HOCTabNavigation />
        {this.renderBackButton()}
        {this.renderKeyboardSpacer()}
      </View>
    );
  }
  render() {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.20)');
    }

    return (
      <View style={styles.app}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.20)"
          animated
        />
        {this.renderLoader()}
        {this.renderLogin()}
        {this.renderNoOrg()}
        {this.renderApp()}
        <HOCModal />
        <HOCLoading />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.connection.get('token'),
    myId: state.me.get('id'),
    readyInOrg: state.connection.get('readyInOrg'),
    hasConnected: state.connection.get('hasConnected'),
    status: state.connection.get('status'),
    isHydrated: state.main.get('isHydrated'),
  };
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

export default codePush(codePushOptions)(connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(App));
