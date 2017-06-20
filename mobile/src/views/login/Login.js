import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { View, TextInput, StyleSheet, Text, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RippleButton from '../../components/ripple-button/RippleButton';
import { colors, viewSize } from '../../utils/globalStyles';
import { api } from '../../../swipes-core-js/actions';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      version: 'unfound',
      keyboardOpen: false
    };

    codePush.getUpdateMetadata().then((pack) => {
      console.log('pack', pack);
      if (pack) {
        this.setState({ version: pack.label });
      }
    });

    this.signIn = this.signIn.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.focusNext = this.focusNext.bind(this);
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
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
    request('users.signin', {
      email: email.toLowerCase(),
      password,
    }).then((res) => {
    });
  }
  focusNext() {
    this.refs.passwordInput.focus();
  }
  renderButton() {
    const { keyboardOpen } = this.state;

    if (keyboardOpen) {
      return undefined;
    }

    return (
      <RippleButton onPress={this.signIn}>
        <View style={styles.button}>
          <Text style={styles.buttonLabel}>Sign in</Text>
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
  render() {
    const { version } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {this.renderGradient()}
          <ScrollView>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleLabel}>Sign in to your Workspace</Text>
            </View>
            <View style={styles.form}>
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
          </ScrollView>
          {this.renderButton()}
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
  titleWrapper: {
    width: viewSize.width,
    marginTop: 60,
    paddingHorizontal: 15,
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
    marginTop: 90,
    paddingBottom: 136,
  },
  input: {
    width: viewSize.width - 30,
    marginLeft: 15,
    height: 50,
    color: 'white',
    fontSize: 15,
    lineHeight: 21,
    borderBottomColor: 'white',
    borderBottomWidth: 1
  },
  input2: {
    width: viewSize.width - 30,
    marginLeft: 15,
    height: 50,
    color: 'white',
    fontSize: 15,
    lineHeight: 21,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginTop: 45,
  },
  button: {
    width: viewSize.width - 30,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    position: 'absolute',
    left: 15,
    bottom: 30,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
