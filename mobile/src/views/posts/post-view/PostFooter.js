import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { setupDelegate, bindAll, getDeep } from 'swipes-core-js/classes/utils';
import { fromJS } from 'immutable';
import { colors, viewSize } from 'globalStyles';
import * as gs from 'styles';
import * as a from 'actions';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ExpandingTextInput from 'components/expanding-text-input/ExpandingTextInput';
import AttachButton from 'components/attach-button/AttachButton';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.border(1, gs.colors.deepBlue20, 'top'),
    ...gs.mixins.flex('row'),
    width: viewSize.width,
    minHeight: 54,
  },
  backButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 54,
    maxWidth: 54,
  },
  inputWrapper: {
    ...gs.mixins.size(1),
    ...Platform.select({
      ios: {
        ...gs.mixins.padding(6, 0),
      },
      android: {
        ...gs.mixins.padding(6, 0, 6, 12),
      },
    }),
    minHeight: 54,
  },
  inputBorder: {
    ...gs.mixins.border(1, gs.colors.deepBlue10),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.padding(12, 0, 12, 18),
    alignSelf: 'stretch', 
    minHeight: 54 - (6 * 2),
    borderRadius: 25,
  },
  input: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(13, gs.colors.deepBlue80, 18),
    alignSelf: 'stretch',
  },
  actions: {
    ...gs.mixins.size(1),
    maxWidth: 54,
  },
  iconButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 54,
    maxWidth: 54,
    minHeight: 54,
  }
});

class HOCPostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      attachments: fromJS([]),
      isLoadingComment: false,
    }
    setupDelegate(this, 'onAddComment', 'onNavigateBack', 'onAutoFocus');
    bindAll(this, ['handleAddComment', 'handleAttach', 'focusInput', 'onChooseAttachmentTypeToAdd', 'onAddAttachment']);
  }
  onChooseAttachmentTypeToAdd() {
    const { actionModal, navPush } = this.props;
    const { attachments } = this.state;

    if (attachments.size) {
      navPush({
        id: 'AttachmentView',
        title: 'Attachment',
        props: {
          delegate: this,
          initialAttachments: attachments
        },
      });
    } else {
      Keyboard.dismiss();
      actionModal({
        title: 'Add attachment',
        onItemPress: this.onAddAttachment,
        items: fromJS([
          { id: 'url', title: 'Add a URL' },
          { id: 'image', title: 'Upload an image' },
        ]),
      }, { onDidClose: this.onFocusTextarea });
    }
  }
  onAddAttachment(id) {
    const { uploadAttachment } = this.props;

    uploadAttachment(id, this.handleAttach, this.focusInput);
  }
  handleAttach(att) {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.push(att)
    })
  }
  handleAddComment() {
    const { text, attachments } = this.state;
    if(!text || !text.length) {
      return;
    }
    this.onAddComment(text, attachments);
    this.setState({ text: '', attachments: fromJS([]) });
    Keyboard.dismiss();
  }
  focusInput() {
    const input = getDeep(this, 'refs.input.refs.expandingTextInput');

    if (!this.isFocused && input) {
      input.focus();
    }
  }
  renderBackButton() {
    const { text } = this.state;

    if (Platform.OS === 'android') {
      return undefined;
    }

    return (
      <RippleButton onPress={this.onNavigateBack}>
        <View style={styles.backButton}>
          <Icon icon="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    )
  }
  renderSendButton() {
    const { isLoading } = this.props;
  
    if (isLoading('commenting')) {

      return (
        <View style={styles.iconButton}>
          <ActivityIndicator color={colors.blue100} />
        </View>
      )
    }

    return (
      <RippleButton style={styles.iconButton} rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
        <View style={styles.iconButton}>
          <Icon icon="Send" width="24" height="24" fill={gs.colors.blue100} />
        </View>
      </RippleButton>
    )
  }


  render() {
    const { placeholder } = this.props;
    const { attachments } = this.state;

    return (
      <View style={styles.container}>
        {this.renderBackButton()}
        <TouchableWithoutFeedback onPress={this.focusInput}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBorder}>
              <ExpandingTextInput
                ref="input"
                onChangeText={(text) => this.setState({ text })}
                style={styles.input}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                autoCorrect={true}
                placeholder={placeholder}
                minRows={1}
                maxRows={4}
                value={this.state.text}
                onFocus={() => { this.isFocused = true }}
                onBlur={() => { this.isFocused = false }}
              />
              <AttachButton 
                numberOfAttachments={attachments.size} 
                delegate={this} 
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.actions}>
          {this.renderSendButton()}
        </View>
      </View>
    )
  }
}
const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  uploadAttachment: a.attachments.upload,
  actionModal: a.modals.action,
})(HOCPostFooter);

