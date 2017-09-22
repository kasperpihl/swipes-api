import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { colors, viewSize } from 'globalStyles';
import RippleButton from 'RippleButton';
import ParsedText from "react-native-parsed-text";
import Icon from 'Icon';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    minHeight: 54,
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue5,
    flexDirection: 'row'
  },
  backButton: {
    flex: 1,
    maxWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  verticalSeperatorRight: {
    width: 1,
    height: 40,
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? -7 : 7,
    backgroundColor: colors.deepBlue10,
  },
  inputWrapper: {
    flex: 1,
    height: 54,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'blue',
  },
  inputBorder: {
    flex: 1,
    borderColor: colors.deepBlue10,
    borderWidth: 1,
    borderRadius: 100,
  },
  input: {
    padding: 0,
    margin: 0,
    fontSize: 12,
    color: colors.deepBlue80,
    lineHeight: 15,
    textAlignVertical: 'top',
    includeFontPadding: false,
    backgroundColor: 'purple',
  },
  message: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.deepBlue5,
    borderRadius: 18,
    fontSize: 13,
    color: colors.deepBlue80,
    lineHeight: 18,
    alignSelf: 'flex-start'
  },
  nameLabel: {
    fontSize: 13,
    color: colors.deepBlue100,
    fontWeight: '500',
    lineHeight: 18
  },
  actions: {
    flex: 1,
    maxWidth: 64,
    backgroundColor: 'red'
  }
});

class PostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      inputHeight: 15
    }
    setupDelegate(this, 'onAddComment', 'onNavigateBack');

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onContentSizeChange(e) {
    const { inputHeight } = this.state;

    if (inputHeight !== e.nativeEvent.contentSize.height) {
      this.setState({ inputHeight: e.nativeEvent.contentSize.height })
    }
  }
  handleFocus() {
    const { inputActive } = this.state;
  
    if (!inputActive) this.setState({ inputActive: true })
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

    if (Platform.OS === "ios") {
      return undefined;
    }
         /* <Icon name="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
          <View style={styles.verticalSeperatorRight} /> */

    return (
      <RippleButton onPress={this.handleBackButton}>
        <View style={styles.backButton}>
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
  renderText(matchingString, matches) {
    return matches[2];
  }
  renderInput() {
    const { placeholder } = this.props;
    const { inputHeight: iH } = this.state;
    const lineNumbers = parseInt(inputHeight / 15);
    const inputHeight = { height: iH };
    
    return(
      <View style={styles.inputWrapper}>
        <View style={styles.inputBorder}>
          <TextInput
            onChangeText={(text) => this.setState({ text })}
            numberOfLines={lineNumbers}
            multiline={true}
            style={[styles.input, inputHeight]}
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            autoCorrect={true}
            placeholder={placeholder}
            onContentSizeChange={this.onContentSizeChange}
          >
            <ParsedText
              style={styles.message}
              selectable={true}
              parse={[
                { pattern: /<!([A-Z0-9]*)\|(.*?)>/i, style: styles.nameLabel, renderText: this.renderText},
              ]}
            >
              {this.state.text}
            </ParsedText>
          </TextInput>
        </View>
      </View>
    )
  }
  renderActions() {
    return (
      <View style={styles.actions}>
        
      </View>
    )
  }
  render() {
        // {this.renderBackButton()}
        // {this.renderInput()}
        // {this.renderActions()}



    const { placeholder } = this.props;
    const { inputHeight: iH } = this.state;
    const lineNumbers = parseInt(inputHeight / 15);
    const inputHeight = { height: iH };

    return (
      <View style={styles.container}>

        <View style={styles.inputWrapper} >
          <TextInput
            onChangeText={(text) => this.setState({ text })}
            numberOfLines={lineNumbers}
            multiline={true}
            style={[styles.input, inputHeight]}
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            autoCorrect={true}
            placeholder={placeholder}
            onContentSizeChange={this.onContentSizeChange}
          >
            <ParsedText
              style={styles.message}
              selectable={true}
              parse={[
                { pattern: /<!([A-Z0-9]*)\|(.*?)>/i, style: styles.nameLabel, renderText: this.renderText},
              ]}
            >
              {this.state.text}
            </ParsedText>
          </TextInput>
        </View>

      </View>
    )
  }
}

export default PostFooter
// const { string } = PropTypes;
PostFooter.propTypes = {};
