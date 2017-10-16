import React, { PureComponent } from 'react';
import { View, BackHandler, Platform, UIManager, LayoutAnimation, ScrollView, StyleSheet } from 'react-native';
import { connect } from "react-redux";
import { viewSize } from 'globalStyles';
import * as a from "actions";
import Login from 'views/login/Login';
import SignupIntro from './SignupIntro';
import WelcomeScreen from './WelcomeScreen';

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
  }
})

class HOCLoginFlow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignupIntro: false,
    };

    this.onBackPress = this.onBackPress.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress() {
    const { showLogin, showSignupIntro } = this.state;
    
    if (showLogin || showSignupIntro)  {
      this.onShowWelcome();

      return true;
    }
  }
  onShowWelcome() { 
    this.refs.scrollView.scrollTo({
      y: 0,
      x: 0,
      animated: true
    });

    this.setState({ showLogin: false, showSignupIntro: false });
  }
  onShowLogin() {
    this.setState({ showLogin: true, showSignupIntro: false });

    this.refs.scrollView.scrollTo({
      y: 0,
      x: viewSize.width,
      animated: true
    });
  }
  onShowSignupIntro() {
    this.setState({ showLogin: false, showSignupIntro: true });

    this.refs.scrollView.scrollTo({
      y: 0,
      x: viewSize.width,
      animated: true
    });
  }
  onShowSignup() {
    const { browser } = this.props;

    browser('https://workspace.swipesapp.com/register');
  }
  renderSecondScreen() {
    const { showLogin, showSignupIntro } = this.state;

    if (showLogin || showSignupIntro) {

      if (showLogin) {
        return <Login />;
      }

      return <SignupIntro delegate={this} />;
    }
    
    return undefined;
  }
  render() {
    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        ref="scrollView"
      >
        <View style={{ width: viewSize.width }}>
          <WelcomeScreen delegate={this} />
        </View>

        <View style={{ width: viewSize.width }}>
          {this.renderSecondScreen()}
        </View>
      </ScrollView>
    )
  }
}
// const { string } = PropTypes;

HOCLoginFlow.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  browser: a.links.browser,
})(HOCLoginFlow);
