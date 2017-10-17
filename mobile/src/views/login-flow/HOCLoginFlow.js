import React, { PureComponent } from 'react';
import { View, BackHandler, Platform, UIManager, LayoutAnimation, ScrollView, StyleSheet } from 'react-native';
import { connect } from "react-redux";
import { viewSize } from 'globalStyles';
import * as a from "actions";
import * as ca from 'swipes-core-js/actions';
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
      modalOpen: false,
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
    const { browser, apiUrl } = this.props;

    browser(`${apiUrl}/register`);
  }
  onOpenResetModal() {
    const { promptModal } = this.props;
    this.setState({ modalOpen: true });

    promptModal({
      title: 'Reset password',
      placeholder: 'Enter your email',
      keyboardType: 'email-address',
      onConfirmPress: (e, email) => {
        this.handleResetPassword(email);
        this.setState({ modalOpen: false });
      },
      onCancelPress: () => {
        this.setState({ modalOpen: false });
      }
    })
  }
  handleResetPassword(resetEmail) {
    const { alertModal, request } = this.props;

    request('me.sendResetEmail', {
      email: resetEmail,
    }).then((res) => {
      alertModal({
        title: 'Reset password',
        message: 'We will send you an email to change your password.',
      });
    });
    
  }
  renderSecondScreen() {
    const { showLogin, showSignupIntro, modalOpen } = this.state;

    if (showLogin || showSignupIntro) {

      if (showLogin) {
        return <Login  delegate={this} modalOpen={modalOpen}/>;
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
        keyboardShouldPersistTaps="always"
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
  apiUrl: state.getIn(['globals', 'apiUrl']),
});

export default connect(mapStateToProps, {
  browser: a.links.browser,
  promptModal: a.modals.prompt,
  alertModal: a.modals.alert,
  request: ca.api.request,
})(HOCLoginFlow);
