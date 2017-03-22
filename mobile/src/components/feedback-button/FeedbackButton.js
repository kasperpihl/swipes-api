import React, { Component } from 'react';
import { Platform, TouchableNativeFeedback, TouchableHighlight } from 'react-native';


class FeedbackButton extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  renderFeedbackButton() {

    return (
      <TouchableNativeFeedback {...this.props}>
        {this.props.children}
      </TouchableNativeFeedback>
    )
  }
  renderHighlightButton() {

    return (
      <TouchableHighlight  {...this.props}>
        {this.props.children}
      </TouchableHighlight >
    )
  }
  renderButton() {

    if (Platform.OS === 'android') {
      return this.renderFeedbackButton()
    } else {
      return this.renderHighlightButton()
    }
  }
  render() {
    return this.renderButton()
  }
}

export default FeedbackButton;