import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { 
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import { setupDelegate } from 'react-delegate';
import { colors, viewSize, statusbarHeight } from 'globalStyles';
import { api } from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import * as gs from 'styles';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.flex('row', 'center', 'top'),
    flex: 1,
  },
  errorWrapper: {
    ...gs.mixins.padding(15, 30),
    position: 'absolute',
    left: 0, bottom: 0,
    backgroundColor: colors.deepBlue100,
    width: viewSize.width,
  },
  errorLabel: {
    ...gs.mixins.font(12, 'white', 15),
    textAlign: 'center',
  },
  titleWrapper: {
    width: viewSize.width,
    marginTop: 60,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  titleLabel: {
    ...gs.mixins.font(30, 'white', 34, '300'),
  },
  gradient: {
    ...gs.mixins.size(viewSize.width, viewSize.height),
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backButtonWrapper: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
  },
  backButton: {
    ...gs.mixins.size(44),
    ...gs.mixins.flex('center'),
    marginLeft: -15,
    marginRight: 15,
  },
  form: {
    width: viewSize.width,
    marginTop: 45,
  },
  inputWrapper: {
    ...gs.mixins.border(1, 'white', 'bottom'),
    width: viewSize.width - 30,
    marginLeft: 15,
  },
  input: {
    ...gs.mixins.size(viewSize.width - 30, 50),
    ...gs.mixins.font(15, 'white', 21),
  },
  input2: {
    ...gs.mixins.size(viewSize.width - 30, 50),
    ...gs.mixins.font(15, 'white', 21),
    marginTop: 30,
  },
  button: {
    ...gs.mixins.border(1, 'white'),
    ...gs.mixins.borderRadius(3),
    ...gs.mixins.flex('center'),
    ...gs.mixins.margin(60, 0, 15, 15),
    ...gs.mixins.size(viewSize.width - 30, 61),
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    ...gs.mixins.font(12, 'white', 'bold'),
    backgroundColor: 'transparent',
  },
  resetButton: {
    backgroundColor: 'transparent'
  },
  resetLabel: {
    ...gs.mixins.font(12, 'white'),
    ...gs.mixins.padding(22, 0),
    textAlign: 'center',
  }
});

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

    setupDelegate(this, 'onShowWelcome', 'onOpenResetModal')
    setupLoading(this);

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
    const keyboardInEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const keyboardOutEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    this.keyboardDidShowListener = Keyboard.addListener(keyboardInEvent, this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener(keyboardOutEvent, this.keyboardDidHide);
  }
  componentWillUpdate() {
    // LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  keyboardDidShow() {
    const { modalOpen } = this.props;

    if (!modalOpen) {
      this.setState({ keyboardOpen: true });
    }
  }
  keyboardDidHide() {
    this.setState({ keyboardOpen: false });
  }
  signIn() {
    const { request } = this.props;
    const { email, password } = this.state;

    this.setState({ errorMessage: '' })
    this.setLoading('loging');

    request('users.signin', {
      email: email.toLowerCase(),
      password,
    }).then((res) => {

      this.clearLoading('loging');

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
    const { keyboardOpen } = this.state;
    let extraButtonStyles = {};

    if (keyboardOpen) {
      extraButtonStyles = {
        ...gs.mixins.margin(15, 0, 15, 15),
      }
    }

    
    if (this.isLoading('loging')) {
      return (
        <View style={[styles.button, extraButtonStyles]}>
          <ActivityIndicator color='white' />
        </View>
      )
    }

    return (
      <RippleButton onPress={this.signIn}>
        <View style={[styles.button, extraButtonStyles]}>
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
  renderTitle() {
    const { keyboardOpen } = this.state;

    if (keyboardOpen) {
      return undefined;
    }

    return (
      <View style={[styles.titleWrapper, { flexDirection: 'row' }]}>
        {this.renderBackButton()}
        <Text selectable={true} style={styles.titleLabel}>Sign in to your Workspace</Text>
      </View>
    )
  }
  renderResetPassword() {

    return (
      <RippleButton onPress={this.onOpenResetModal} style={styles.resetButton}>
        <View style={styles.resetButton}>
          <Text style={styles.resetLabel}>
            Reset my password
          </Text>
        </View>
      </RippleButton>
    )
  }
  renderForm() {
    const { keyboardOpen } = this.state;
    let extraFormStyles = {};

    if (keyboardOpen) {
      extraFormStyles = {
        marginTop: 33
      }
    }

    return (
      <View style={[styles.form, extraFormStyles]}>
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
    )
  }
  render() {
    const { version, keyboardOpen } = this.state;

    let scrollViewWrapperStyles = {
      flex: 1,
    }

    if (keyboardOpen) {
      scrollViewWrapperStyles = {
        ...gs.mixins.flex('column', 'left', 'center'),
        flex: 1,
      }
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {this.renderGradient()}
          <View style={{flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={scrollViewWrapperStyles}>
              <View>
                {this.renderTitle()}
                {this.renderForm()}
                {this.renderButton()}
                {this.renderResetPassword()}
              </View>
              {this.renderErrorLabel()}
              {this.renderKeyboardSpacer()}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(null, {
  request: api.request,
})(Login);
