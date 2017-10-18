import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { setupDelegate } from 'react-delegate';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import * as gs from 'styles';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(viewSize.width, viewSize.height),
    backgroundColor: colors.blue100,
    ...gs.mixins.padding(30, 30, 0, 30),
  },
  backButtonWrapper: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
    ...Platform.select({
      android: {
        marginTop: 16,
        marginLeft: -16,
        marginRight: 16,
      }
    })
  },
  backButton: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
    ...Platform.select({
      ios: {
        marginTop: 16,
        marginLeft: -16,
        marginRight: 16,
      }
    })
  },
  title: {
    ...gs.mixins.font(30, 'white', 34, '300'),
    ...gs.mixins.margin(21, 0, 60, 0),
    alignSelf: 'flex-start'
  },
  paragraph: {
    ...gs.mixins.font(15, 'white', 20),
  },
  button: {
    backgroundColor: 'white',
    marginTop: (Platform.OS === 'ios') ? 30 : 0,
  },
  buttonWrapper: { 
    backgroundColor: 'white',
    marginTop: (Platform.OS === 'android') ? 30 : 0,
  },
  buttonLabel: {
    ...gs.mixins.padding(15, 30),
    ...gs.mixins.font(16, colors.blue100),
    textAlign: 'center',
  },
})

class SignupIntro extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onShowWelcome', 'onShowSignup');
  }
  componentDidMount() {
  }
  renderBackButton() {

    if (Platform.OS === 'android') return undefined;

    return (
      <RippleButton style={styles.backButton} onPress={this.onShowWelcome}>
        <View style={styles.backButtonWrapper}>
          <Icon name="ArrowLeftLine" width="24" height="24" fill="white" />
        </View>
      </RippleButton>
    )
  }
  render() {
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: 'row' }}>
          {this.renderBackButton()}
          <Text style={styles.title}>
            New to Swipes Workspace?
          </Text>
        </View>

        <Text style={styles.paragraph}>
          This is the mobile companion to the desktop Swipes Workspace app. Get started with the new company account from there. 
        </Text>
        <Text style={[styles.paragraph, { marginTop: 21 }]}>
          If your company already has an account, just ask the Account Admin to invite you.
        </Text>

        {/*<RippleButton rippleColor="#FFFFFF" style={styles.button} onPress={this.onShowSignup}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonLabel}>Register</Text>
          </View>
        </RippleButton>*/}
      </View>
    );
  }
}

export default SignupIntro

// const { string } = PropTypes;

SignupIntro.propTypes = {};
