import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, ScrollView, Platform } from 'react-native';
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
    };
    codePush.getUpdateMetadata().then((pack) => {
      console.log('pack', pack);
      if (pack) {
        this.setState({ version: pack.label });
      }
    });
    this.signIn = this.signIn.bind(this);
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
      <View style={styles.container}>
        {this.renderGradient()}
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            placeholder="email"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            returnKeyType="go"
            placeholder="password"
            secureTextEntry
            onSubmitEditing={this.signIn}
          />
          <RippleButton onPress={this.signIn}>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>Sign in</Text>
            </View>
          </RippleButton>
        </ScrollView>
        {this.renderKeyboardSpacer()}
      </View>
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
    justifyContent: 'center',
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
  input: {
    width: 250,
    height: 50,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: '#333ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'white',
  },
});
