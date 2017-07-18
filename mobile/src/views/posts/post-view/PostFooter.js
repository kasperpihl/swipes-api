import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, UIManager, LayoutAnimation } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from '../../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../../utils/globalStyles';
import RippleButton from '../../../components/ripple-button/RippleButton';
import Icon from '../../../components/icons/Icon';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    minHeight: 54,
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue5,
    zIndex: 100,
    flexDirection: 'row',
  },
  iconButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textareaWrapper: {
    flex: 1,
    paddingVertical: 4,
    ...Platform.select({
      android: {
        paddingLeft: 9,
      },
    }),
  },
  textareaBorder: {
    borderWidth: 1,
    borderColor: colors.deepBlue5,
    borderRadius: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: colors.deepBlue80,
    lineHeight: 15,
    paddingLeft: 15,
  }
})

class PostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
<<<<<<< HEAD
    setupDelegate(this);
    this.callDelegate.bindAll('onAddComment', 'onNavigateBack')

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
=======
    // setupDelegate(this);
>>>>>>> e6acaf77d213cd4f1bb6f872a76be029866458bf
  }
  handleAddComment() {
    const { text } = this.state;

    this.onAddComment(text);
    this.setState({ text: '' });
    Keyboard.dismiss();
  }
  handleBackButton() {
    this.onNavigateBack()
  }
  renderBackButton() {
    const { text } = this.state;

    if (Platform.OS === "android") {
      return undefined;
    }

    return (
      <RippleButton onPress={this.handleBackButton}>
        <View style={styles.iconButton}>
          <Icon name="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    )
  }
  renderTextarea() {
    return (
      <View style={styles.textareaWrapper}>
        <View style={styles.textareaBorder}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
            multiline={true}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    )
  }
  renderSendButton() {
    return (
      <RippleButton rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
        <View style={styles.iconButton}>
          <Icon name="Send" width="24" height="24" fill={colors.blue100} />
        </View>
      </RippleButton>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderBackButton()}
        {this.renderTextarea()}
        {this.renderSendButton()}
      </View>
    )
  }
}

export default PostFooter
// const { string } = PropTypes;
PostFooter.propTypes = {};
