import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { fromJS } from 'immutable';
import { colors, viewSize } from 'globalStyles';
import * as gs from 'styles';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ExpandingTextInput from 'components/expanding-text-input/ExpandingTextInput';
import HOCAttachButton from 'components/attach-button/HOCAttachButton';

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
    minWidth: 64,
    maxWidth: 64,
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
  attachmentContainer: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 48,
    maxWidth: 48,
    minHeight: 48,
  },
  numberOfAttachments: {
    ...gs.mixins.padding(4, 8, 3, 8),
    ...gs.mixins.flex('center'),
    backgroundColor: '#007AFF',
    borderRadius: 24 / 2,
  },
  numberOfAttachmentsLabel: {
    ...gs.mixins.font(13, 'white'),
  },
  actions: {
    ...gs.mixins.size(1),
    maxWidth: 64,
  },
  iconButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 64,
    maxWidth: 64,
    minHeight: 54,
  }
});

class PostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      attachments: fromJS([]),
      isLoadingComment: false,
    }
    setupDelegate(this, 'onAddComment', 'onNavigateBack', 'onAutoFocus');

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleAttach = this.handleAttach.bind(this);
    this.handleOpenAttachments = this.handleOpenAttachments.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { isLoadingComment } = this.state;
    
    if (isLoadingComment !== nextProps.isLoading('commenting')) {
      this.setState({ isLoadingComment: nextProps.isLoading('commenting') })
    }

  }
  handleOpenAttachments() {
    const { navPush } = this.props;
    const { attachments } = this.state;

    this.onAutoFocus();
    Keyboard.dismiss();

    navPush({
      id: 'AttachmentView',
      title: 'Attachment',
      props: {
        delegate: this,
        initialAttachments: attachments
      },
    })
  }
  handleAttach(att) {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.push(att)
    })
  }
  handleAddComment() {
    const { text, attachments } = this.state;

    this.onAddComment(text, attachments);
    this.setState({ text: '', attachments: fromJS([]) });
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
    const { isLoadingComment } = this.state;
  
    if (isLoadingComment) {

      return (
        <View style={styles.iconButton}>
          <ActivityIndicator color={colors.blue100} />
        </View>
      )
    }

    return (
      <RippleButton style={styles.iconButton} rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
        <View style={styles.iconButton}>
          <Icon name="Send" width="24" height="24" fill={gs.colors.blue100} />
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
  renderAttachmentButton() {
    const { attachments } = this.state;
    
    if (!attachments.size) {

      return (
        <TouchableOpacity onPress={this.handleOpenAttachments}>
          <View style={styles.attachmentContainer}>
            <Icon name="Attachment" width="24" height="24" fill={gs.colors.deepBlue50} />
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity onPress={this.handleOpenAttachments}>
        <View style={styles.attachmentContainer}>
          <View style={styles.numberOfAttachments}>
            <Text style={styles.numberOfAttachmentsLabel}>{attachments.size}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )

  }
  render() {
    const { placeholder } = this.props;
    const { attachments } = this.state;

    return (
      <View style={styles.container}>
        {this.renderBackButton()}
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
            />
            {this.renderAttachmentButton()}
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
