import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { request } from './actions';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Swiper from 'react-native-swiper';
import ViewController from './navigation/view-controller/ViewController';
import Profile from './views/profile/Profile';
import GoalList from './views/goallist/GoalList';
import Dashboard from './views/dashboard/Dashboard';
import Login from './views/login/Login';
import { colors, viewSize } from './utils/globalStyles';

const profile = {
  key: '1',
  title: 'Profile',
  component: Profile,
}

const dashboard = {
  key: '2',
  title: 'dashboard',
  component: Dashboard,
}

const goalList = {
  key: '3',
  title: 'goalList',
  component: GoalList,
}

class App extends PureComponent {
  renderLoader() {
    const { isHydrated } = this.props;
    if(isHydrated){
      return undefined;
    }
    return <Text>Loading</Text>
  }
  renderLogin(){
    const { token, isHydrated } = this.props;
    console.log(token);
    if(token || !isHydrated){
      return undefined;
    }
    return <Login />;
  }
  renderApp() {
    const { token, isHydrated } = this.props;
    if(!token || !isHydrated){
      return undefined;
    }
    return (
      <Swiper style={styles.app} loop={false} showsPagination={false}>
        <ViewController scene={profile} navId="Profile"/>
        <ViewController scene={dashboard} navId="Dashboard"/>
        <ViewController scene={goalList} navId="Goallist"/>
      </Swiper>
    );
  }
  render() {
    return (
      <View style={styles.app}>
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
    isHydrated: state.getIn(['main', 'isHydrated']),
  };
}

export default connect(mapStateToProps, {})(App);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'red'
  },
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: viewSize.width,
    height: viewSize.height
  }
});
