import React, { PureComponent } from 'react'
import { View, TextInput, StyleSheet, Platform } from 'react-native';

class ExpandingTextInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  componentWillMount() {
    const { style } = this.props;

    if (StyleSheet.flatten(style).lineHeight) {
      this.setState({ lineHeight: StyleSheet.flatten(style).lineHeight, inputHeight: StyleSheet.flatten(style).lineHeight})
    }
  }
  getInputSize() {
    const { minRows, maxRows } = this.props;
    const { inputHeight, lineHeight } = this.state;
    const current = Math.round((inputHeight / lineHeight));
  
    return Math.min(Math.max(minRows, current), maxRows);
  }
  onKeyPress(e) {
    const numberOfLines = this.getInputSize();
    console.log('hi')
    if (e.key === 'Enter' && numberOfLines >= 5) {
      
    }
  }
  onContentSizeChange(e) {
    const { inputHeight } = this.state;
    const numberOfLines = this.getInputSize();

    if (inputHeight !== e.nativeEvent.contentSize.height) {
      this.setState({ inputHeight: Math.round(e.nativeEvent.contentSize.height) })
    }
  }
  render() {
    const { style, children, ...rest } = this.props;
    const { lineHeight } = this.state;
    const lineNumbers = this.getInputSize();
    const iOSInputHeight = Platform.OS === 'ios' ? { height: (this.getInputSize() * lineHeight) } : {};

    if (children) {
      return (
        <TextInput
          numberOfLines={lineNumbers}
          multiline={true}
          style={[style, iOSInputHeight]}
          onContentSizeChange={this.onContentSizeChange}
          onKeyPress={this.onKeyPress}
          {...rest}
        >
          {children}
        </TextInput>
      )
    }


    return (
      <TextInput
        numberOfLines={lineNumbers}
        multiline={true}
        style={[style, iOSInputHeight]}
        onContentSizeChange={this.onContentSizeChange}
        onKeyPress={this.onKeyPress}
        {...rest}
      />
    )
  }
}

export default ExpandingTextInput

