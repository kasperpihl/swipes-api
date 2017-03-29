import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { request } from './actions';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import ViewController from './navigation/view-controller/ViewController';
import HOCProfile from './views/profile/HOCProfile';
import HOCGoalList from './views/goallist/HOCGoalList';
import HOCDashboard from './views/dashboard/HOCDashboard';
import Login from './views/login/Login';
import Icon from './components/icons/Icon';
import { colors, viewSize } from './utils/globalStyles';

const profile = {
  key: '1',
  title: 'Profile',
  component: HOCProfile,
}

const dashboard = {
  key: '2',
  title: 'dashboard',
  component: HOCDashboard,
}

const goalList = {
  key: '3',
  title: 'goalList',
  component: HOCGoalList,
}

class App extends PureComponent {
  constructor() {
    super();

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderLoader() {
    const { isHydrated, lastConnect } = this.props;

    if(isHydrated && lastConnect){
      return undefined;
    }

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        colors={[colors.bgGradientFrom, colors.bgGradientTo]}
        style={styles.gradient}
      >
        <Icon name="SwipesLogoText" fill={colors.bgColor} width="90"/>
      </LinearGradient>
    )
  }
  renderLogin(){
    const { token, isHydrated } = this.props;

    if(token || !isHydrated){
      return undefined;
    }

    return <Login />;
  }
  renderApp() {
    const { token, isHydrated, lastConnect } = this.props;

    if(!token || !isHydrated || !lastConnect){
      return undefined;
    }

    return (
      <Swiper style={styles.app} loop={false} showsPagination={false} index={1} bounces={true}>
        <ViewController scene={profile} navId="Profile"/>
        <ViewController scene={dashboard} navId="Dashboard"/>
        <ViewController scene={goalList} navId="Goallist"/>
      </Swiper>
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

export default connect(mapStateToProps, {})(App);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingTop: 24,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: viewSize.width,
    height: viewSize.height + 24,
    alignItems: 'center',
    justifyContent: 'center'
  }
});