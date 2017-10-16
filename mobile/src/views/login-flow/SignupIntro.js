import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { setupDelegate } from 'react-delegate';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import * as gs from 'styles';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(1),
    backgroundColor: colors.blue100,
    ...gs.mixins.padding(30, 30, 0, 30),
  },
  backButtonWrapper: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
    marginTop: 16,
    marginLeft: -16,
    marginRight: 16,
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
    marginTop: 30,
  },
  buttonWrapper: { 
    backgroundColor: 'white',
  },
  buttonLabel: {
    ...gs.mixins.padding(15, 30),
    ...gs.mixins.font(16, colors.blue100),
    textAlign: 'center',
  },
  backButton: {
    ...gs.mixins.size(44),
    position: 'absolute',
    left: 30,
    top: 30,
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
          If your company already has an account, just ask the Account Admin to invite you.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 21 }]}>
          if you want to start a new company account, it's a free for 14 days. You can register on workspace.swipesapp.com/register
        </Text>

        <RippleButton rippleColor="#FFFFFF" style={styles.button} onPress={this.onShowSignup}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.buttonLabel}>Register</Text>
          </View>
        </RippleButton>
      </View>
    );
  }
}

export default SignupIntro

// const { string } = PropTypes;

SignupIntro.propTypes = {};
