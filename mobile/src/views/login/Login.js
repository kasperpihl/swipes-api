import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import codePush from "react-native-code-push";
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text } from 'react-native';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
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
      if(pack) {
        this.setState({ version: pack.label });
      }
    })
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
  render() {
    const { version } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="height" style={styles.container}>
          <Text>{version}</Text>
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
          <FeedbackButton onPress={this.signIn}>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>Sign in</Text>
            </View>
          </FeedbackButton>
        </KeyboardAvoidingView>
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
    backgroundColor: colors.bgColor,
    // backgroundColor: 'red',
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
