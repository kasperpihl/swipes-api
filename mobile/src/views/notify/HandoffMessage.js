import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Keyboard, Platform } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { attachmentIconForService, setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import NotificationItem from '../dashboard/NotificationItem';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  input: {
    padding: 0,
    margin: 0,
    paddingRight: 9,
    paddingLeft: 15,
    paddingBottom: 15,
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        height: 25 * 3,
      },
    }),
  },
});

class Notify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { text: props.initialText };

    setupDelegate(this);
    this.callDelegate.bindAll('onChangeText');
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const text = event.nativeEvent.text;
    this.setState({ text });
    this.onChangeText(text);
  }
  render() {
    return (
      <TextInput
        numberOfLines={3}
        multiline
        autoFocus
        placeholder={this.props.placeholder}
        autoCapitalize="sentences"
        onChange={this.onChange}
        initialValue={this.props.text}
        placeholderTextColor={colors.deepBlue50}
        style={styles.input}
        underlineColorAndroid="rgba(255,255,255,0)"
      />
    );
  }
}

export default Notify;
