import React, { PureComponent } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { setupDelegate } from 'react-delegate';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import * as gs from 'styles';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  scrollContainer: {
    ...gs.mixins.size(1),
  },
  container: {
    ...gs.mixins.size(1),
    ...gs.mixins.padding(33, 30, 0, 30),
  },
  logoWrapper: {
    ...gs.mixins.padding(0, 0, (viewSize.height * .03), 0),
  },
  illustration: {

  },
  title: {
    ...gs.mixins.font(36, colors.deepBlue100, 48, '300'),
    marginBottom: (viewSize.height * .04),
  },
  textWrapper: {
    marginBottom: (viewSize.height * .02),
  },
  text: {
    ...gs.mixins.font(15, colors.deepBlue80, 27),
  },
  button: {
    backgroundColor: colors.blue100
  },
  buttonWrapper: { 
    backgroundColor: colors.blue100
  },
  buttonLabel: {
    ...gs.mixins.padding(15, 30),
    ...gs.mixins.font(16, 'white'),
    textAlign: 'center',
  }
})

class WelcomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onShowLogin');
  }
  componentDidMount() {
  }
  render() {

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to your Workspace</Text>
          <View style={styles.illustration}>
            <Icon name="ESWelcome" width="304" height="190" />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>This is the place for your team to communicate and create great work together.</Text>
            <Text style={[styles.text, { marginTop: 21 }]}>We are thrilled to have you here!</Text>
          </View>
          <RippleButton rippleColor="#FFFFFF" style={styles.button} onPress={this.onShowLogin}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonLabel}>Let's get started</Text>
            </View>
          </RippleButton>
        </View>
      </ScrollView>
    );
  }
}

export default WelcomeScreen

// const { string } = PropTypes;

WelcomeScreen.propTypes = {};
