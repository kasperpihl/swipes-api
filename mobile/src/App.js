import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, StatusBar } from 'react-native';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Login from './views/login/Login';
import HOCInfoTab from './views/info-tab/HOCInfoTab';
import Icon from './components/icons/Icon';
import HOCTabNavigation from './components/tab-navigation/HOCTabNavigation';
import HOCAndroidBackButton from './components/android-back-button/HOCAndroidBackButton';
import HOCViewController from './navigation/view-controller/HOCViewController';
import { colors, viewSize } from './utils/globalStyles';
import LoadingModal from './modals/LoadingModal';
import ActionModal from './modals/action-modal/ActionModal';
import HOCConnectionBar from './components/connection-bar/HOCConnectionBar';
import * as a from './actions';

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
    this.onOpened = this.onOpened.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.inFocusDisplaying(2);
  }
  componentDidMount() {
    //this.checkTagsAndUpdate();
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
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
  checkTagsAndUpdate() {
    OneSignal.getTags((receivedTags) => {
      const { myId, isHydrated } = this.props;
      if (!receivedTags) {
        receivedTags = {};
      }
      if (isHydrated && !myId && receivedTags.swipesUserId) {
        OneSignal.deleteTag("swipesUserId");
      } else if (isHydrated && myId && !receivedTags.swipesUserId) {
        OneSignal.sendTag('swipesUserId', myId);
      }
    });
  }
  onOpened(openResult) {
    const { isHydrated, token, ready, sliderChange } = this.props;
    if (ready) {
      sliderChange(0);
    } else {
      this.forwardToIndex = 0;
    }
  }
  renderLoader() {
    const { ready } = this.props;

    if (ready) {
      return undefined;
    }

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.5 }}
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
  renderKeyboardSpacer() {
    if (Platform.OS === 'ios') {
      return <KeyboardSpacer />;
    }

    return undefined;
  }
  renderApp() {
    const { token, ready } = this.props;

    if (!token || !ready) {
      return undefined;
    }

    return (
      <View style={styles.app}>
        <View style={styles.wrapper}>
          <HOCViewController />
        </View>
        <LoadingModal />
        <ActionModal />
        <HOCInfoTab/>
        <HOCTabNavigation />
        <HOCConnectionBar />
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
        {this.renderApp()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.getIn(['connection', 'token']),
    myId: state.getIn(['me', 'id']),
    ready: state.getIn(['connection', 'ready']),
    isHydrated: state.getIn(['main', 'isHydrated']),
  };
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

export default codePush(codePushOptions)(connect(mapStateToProps, {
  sliderChange: a.navigation.sliderChange,
})(App));
