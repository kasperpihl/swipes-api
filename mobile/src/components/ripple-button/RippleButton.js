import React, { Component } from 'react';
import { Platform, TouchableNativeFeedback } from 'react-native';
import MaterialRippleButton from 'react-native-material-ripple';
import { colors } from '../../utils/globalStyles';

class RippleButton extends Component {
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
  renderIosButton() {
    const { children, rippleColor, rippleOpacity, onPress, onLongPress, ...props } = this.props;
    const defaultRippleColor = rippleColor || colors.deepBlue40;
    const opacity = rippleOpacity ? 1 - rippleOpacity : 0.8;

    return (
      <MaterialRippleButton rippleColor={defaultRippleColor} rippleOpacity={rippleOpacity} onPress={onPress} onLongPress={onLongPress} {...props}>
        {children}
      </MaterialRippleButton>
    );
  }
  renderAndroidButton() {
    const { children, rippleColor, rippleOpacity, onPress, onLongPress, ...props } = this.props;
    const opacity = rippleOpacity ? 1 - rippleOpacity : 0.2;
    const defaultRippleColor = rippleColor || colors.deepBlue40;

    const rgb = this.hexToRgb(defaultRippleColor);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

    return (
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rgba)} onLongPress={onLongPress} onPress={onPress} {...props}>
        {children}
      </TouchableNativeFeedback>
    );
  }
  renderButton() {
    if (Platform.OS === 'ios') {
      return this.renderIosButton();
    }

    return this.renderAndroidButton();
  }
  render() {
    return this.renderButton();
  }
}

export default RippleButton;
