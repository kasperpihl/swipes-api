import React, { PureComponent } from 'react'
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import * as gs from 'styles';

class ExpandingTextInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.onContentSizeChange = this.onContentSizeChange.bind(this);
  }
  componentWillMount() {
    const { style } = this.props;

    if (StyleSheet.flatten(style).lineHeight) {
      this.setState({ lineHeight: StyleSheet.flatten(style).lineHeight, inputHeight: StyleSheet.flatten(style).lineHeight})
    }
  }
  componentWillUnmount() {
    clearTimeout(this._contentTimer);
  }
  getInputSize() {
    const { minRows, maxRows } = this.props;
    const { inputHeight, lineHeight } = this.state;
    const current = Math.round((inputHeight / lineHeight));
  
    return Math.min(Math.max(minRows, current), maxRows);
  }
  onContentSizeChange(e) {
    const { inputHeight } = this.state;
    // Home made debouncer
    clearTimeout(this._contentTimer);

    if (inputHeight !== e.nativeEvent.contentSize.height) {
      const height = e.nativeEvent.contentSize.height;
      
      this._contentTimer = setTimeout(() => {
        this.setState({ inputHeight: Math.round(height) })
      }, 50);
    }
  }
  render() {
    const { style, children, ...rest } = this.props;
    const { lineHeight } = this.state;
    const lineNumbers = this.getInputSize();
    const iOSInputHeight = Platform.OS === 'ios' ? { height: (this.getInputSize() * lineHeight) } : {};

    return (
      <TextInput
        ref='expandingTextInput'
        numberOfLines={lineNumbers}
        multiline={true}
        style={[{
          ...gs.mixins.padding(0),
          ...gs.mixins.margin(0),
        }, style, iOSInputHeight]}
        onContentSizeChange={this.onContentSizeChange}
        {...rest}
      >
        {children}
      </TextInput>
    )
  }
}

export default ExpandingTextInput

