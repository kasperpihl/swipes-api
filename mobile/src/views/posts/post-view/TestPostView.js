import React, { PureComponent } from 'react'
import { View, TextInput, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { colors, viewSize } from 'globalStyles';
import ParsedText from "react-native-parsed-text";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    alignSelf: 'stretch',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
    fontSize: 12,
    color: colors.deepBlue80,
    lineHeight: 15,
    textAlignVertical: 'top',
    includeFontPadding: false,
    backgroundColor: 'pink',
    opacity: 1,
  },
  message: {
    fontSize: 13,
    color: colors.deepBlue80,
    lineHeight: 18,
  },
  nameLabel: {
    fontSize: 13,
    color: colors.deepBlue100,
    fontWeight: '500',
    lineHeight: 18
  },
});

class TestPostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      inputHeight: 15
    }

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
  renderText(matchingString, matches) {
    return matches[2];
  }
  render() {
    const { placeholder } = this.props;
    const { inputHeight } = this.state;
    const lineNumbers = parseInt(inputHeight / 15);
    const iOSInputHeight = Platform.OS === 'ios' ? { height: inputHeight } : {};

    return (
      <View style={styles.container}>

        <View style={styles.inputWrapper} >
          <TextInput
            onChangeText={(text) => this.setState({ text })}
            numberOfLines={lineNumbers}
            multiline={true}
            style={[styles.input, iOSInputHeight]}
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            autoCorrect={true}
            placeholder="write comment"
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

export default TestPostView
// const { string } = PropTypes;
TestPostView.propTypes = {};
