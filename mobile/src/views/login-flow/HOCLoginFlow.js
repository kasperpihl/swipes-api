import React, { PureComponent } from 'react';
import { BackHandler, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from "react-redux";
import * as a from "actions";
import Login from 'views/login/Login';
import SignupIntro from './SignupIntro';
import WelcomeScreen from './WelcomeScreen';

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
      this.setState({ showLogin: false, showSignupIntro: false });
      return true;
    }
  }
  onShowWelcome() { 
    this.setState({ showLogin: false, showSignupIntro: false });
  }
  onShowLogin() {
    this.setState({ showLogin: true, showSignupIntro: false });
  }
  onShowSignupIntro() {
    this.setState({ showLogin: false, showSignupIntro: true });
  }
  onShowSignup() {
    const { browser } = this.props;

    browser('https://workspace.swipesapp.com/register');
  }
  render() {
    const { showLogin, showSignupIntro } = this.state;

    if (showLogin) {
      return <Login />
    }

    if (showSignupIntro) {
      return <SignupIntro delegate={this} />
    }

    return <WelcomeScreen delegate={this} />
  }
}
// const { string } = PropTypes;

HOCLoginFlow.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  browser: a.links.browser,
})(HOCLoginFlow);
