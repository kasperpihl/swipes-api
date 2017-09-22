import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { colors, viewSize } from 'globalStyles';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ExpandingTextInput from 'components/expanding-text-input/ExpandingTextInput';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    minHeight: 54,
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue20,
    flexDirection: 'row',
  },
  backButton: {
    flex: 1,
    maxWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    minHeight: 54,
    paddingVertical: 6,
    paddingLeft: 12,
  },
  inputBorder: {
    alignSelf: 'stretch',
    minHeight: 54 - (6 * 2),
    borderColor: colors.deepBlue10,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  input: {
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
    fontSize: 13,
    color: colors.deepBlue80,
    lineHeight: 18,
    includeFontPadding: false,
  },
  actions: {
    flex: 1,
    maxWidth: 64,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

class PostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    setupDelegate(this, 'onAddComment', 'onNavigateBack');

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  handleAddComment() {
    const { text } = this.state;

    this.onAddComment(text, []);
    this.setState({ text: '' });
    Keyboard.dismiss();
  }
  handleBackButton() {
    this.onNavigateBack()
  }
  renderBackButton() {
    const { text } = this.state;

    if (Platform.OS === 'android') {
      return undefined;
    }

    return (
      <RippleButton onPress={this.handleBackButton}>
        <View style={styles.backButton}>
          <Icon name="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    )
  }
  renderSendButton() {
    const { commentLoading } = this.props;

    if (commentLoading) {
      <View style={styles.iconButton}>
        <ActivityIndicator color={colors.blue100} />
      </View>
    }

    return (
      <RippleButton rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
        <View style={styles.iconButton}>
          <Icon name="Send" width="24" height="24" fill={colors.blue100} />
        </View>
      </RippleButton>
    )
  }
  renderActions() {
    return (
      <View style={styles.actions}>
        {this.renderSendButton()}
      </View>
    )
  }
  render() {
    const { placeholder } = this.props;

    return (

      <View style={styles.container}>
        {this.renderBackButton()}
        <View style={styles.inputWrapper}>
          <View style={styles.inputBorder}>
            <ExpandingTextInput
              onChangeText={(text) => this.setState({ text })}
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="sentences"
              autoCorrect={true}
              placeholder={placeholder}
              minRows={1}
              maxRows={2}
              value={this.state.text}
            />
          </View>
        </View>
        {this.renderActions()}
      </View>
    )
  }
}

export default PostFooter
// const { string } = PropTypes;
PostFooter.propTypes = {};
