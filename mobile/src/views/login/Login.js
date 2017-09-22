import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { View, TextInput, StyleSheet, Text, ScrollView, Platform, UIManager, LayoutAnimation, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RippleButton from 'RippleButton';
import { colors, viewSize } from 'globalStyles';
import { api } from 'swipes-core-js/actions';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      version: 'unfound',
      keyboardOpen: false,
      errorMessage: '',
    };

    codePush.getUpdateMetadata().then((pack) => {
      // console.log('pack', pack);
      if (pack) {
        this.setState({ version: pack.label });
      }
    });

    this.signIn = this.signIn.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.focusNext = this.focusNext.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  keyboardDidShow() {
    this.setState({ keyboardOpen: true });
  }
  keyboardDidHide() {
    this.setState({ keyboardOpen: false });
  }
  signIn() {
    const { request } = this.props;
    const { email, password } = this.state;

    this.setState({ errorMessage: '' })

    request('users.signin', {
      email: email.toLowerCase(),
      password,
    }).then((res) => {
      if (res.error && res.error.message) {
        let label = res.error.message;

        if (label === "body /users.signin: Invalid object['email']: did not match format") {
          label = 'Not a valid email';
        }

        this.setState({ errorMessage: label })
      }
    });
  }
  focusNext() {
    this.refs.passwordInput.focus();
  }
  renderButton() {
    return (
      <RippleButton onPress={this.signIn}>
        <View style={styles.button}>
          <Text selectable={true} style={styles.buttonLabel}>Sign in</Text>
        </View>
      </RippleButton>
    )
  }
  renderGradient() {

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.5 }}
        colors={[colors.bgGradientFrom, colors.bgGradientTo]}
        style={styles.gradient}
      >
      </LinearGradient>
    )
  }
  renderKeyboardSpacer() {
    if (Platform.OS === 'ios') {
      return <KeyboardSpacer />;
    }

    return undefined;
  }
  renderErrorLabel() {
    const { errorMessage } = this.state;

    if (!errorMessage) {
      return undefined;
    }

    return (
      <View style={styles.errorWrapper}>
        <Text selectable={true} style={styles.errorLabel}>{errorMessage}</Text>
      </View>
    )
  }
  renderTitle() {
    const { keyboardOpen } = this.state;

    if (keyboardOpen) {
      return undefined;
    }

    return (
      <View style={styles.titleWrapper}>
        <Text selectable={true} style={styles.titleLabel}>Sign in to your Workspace</Text>
      </View>
    )
  }
  render() {
    const { version } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {this.renderGradient()}
          <ScrollView keyboardShouldPersistTaps="always">
            {this.renderTitle()}
            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  placeholder="Email"
                  onSubmitEditing={this.focusNext}
                  placeholderTextColor="white"
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref="passwordInput"
                  style={styles.input2}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  returnKeyType="go"
                  placeholder="Password"
                  placeholderTextColor="white"
                  secureTextEntry
                  onSubmitEditing={this.signIn}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            {this.renderButton()}
          </ScrollView>
          {this.renderErrorLabel()}
          {this.renderKeyboardSpacer()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(null, {
  request: api.request,
})(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  errorWrapper: {
    position: 'absolute',
    left: 0, bottom: 0,
    backgroundColor: colors.deepBlue100,
    paddingHorizontal: 30,
    paddingVertical: 15,
    width: viewSize.width,
  },
  errorLabel: {
    textAlign: 'center',
    color: colors.bgColor,
    fontSize: 12,
    lineHeight: 15,
  },
  titleWrapper: {
    width: viewSize.width,
    marginTop: 60,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  titleLabel: {
    fontSize: 39,
    fontWeight: 'bold',
    lineHeight: 51,
    color: 'white',
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
  form: {
    width: viewSize.width,
    marginTop: 45,
  },
  inputWrapper: {
    width: viewSize.width - 30,
    marginLeft: 15,
    borderBottomColor: 'white',
    borderBottomWidth: 1
  },
  input: {
    width: viewSize.width - 30,
    height: 50,
    color: 'white',
    fontSize: 15,
    lineHeight: 21,
  },
  input2: {
    width: viewSize.width - 30,
    height: 50,
    color: 'white',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 30,
  },
  button: {
    width: viewSize.width - 30,
    height: 61,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 15,
    marginTop: 60,
    marginBottom: 30,
  },
  buttonLabel: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
