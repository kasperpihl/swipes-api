import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard, Platform, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import getDeep from 'swipes-core-js/utils/getDeep';
import { fromJS } from 'immutable';
import { colors } from 'globalStyles';
import * as gs from 'styles';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ExpandingTextInput from 'components/expanding-text-input/ExpandingTextInput';
import AttachButton from 'components/attach-button/AttachButton';
import SW from './CommentComposer.swiss';

const styles = StyleSheet.create({
  input: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(13, gs.colors.deepBlue80, 18),
    alignSelf: 'stretch',
  },
});

@connect(state => ({
}), {
  uploadAttachment: a.attachments.upload,
  actionModal: a.modals.action,
  request: ca.api.request,
})
export default class CommentComposer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      attachments: fromJS([]),
    };
    setupDelegate(this, 'onAutoFocus');
    bindAll(this, ['handleAddComment', 'handleAttach', 'focusInput', 'onChooseAttachmentTypeToAdd', 'onAddAttachment', 'onNavigateBack']);
  }
  // componentDidUpdate(prevProps) {
  //   if (!prevProps.isActive && this.props.isActive && this.shouldAutoFocus) {
  //     this.shouldAutoFocus = false;
  //     const input = getDeep(this, 'refs.postView.refs.postFooter.refs.input.refs.expandingTextInput');

  //     if (input && input.focus) {
  //       input.focus();
  //     }
  //   }
  // }
  onNavigateBack() {
    const { navPop } = this.props;

    navPop();
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
          initialAttachments: attachments,
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
  // onAutoFocus() {
  //   this.shouldAutoFocus = true
  // }
  onAddAttachment(id) {
    const { uploadAttachment } = this.props;

    uploadAttachment(id, this.handleAttach, this.focusInput);
  }
  handleAttach(att) {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.push(att),
    });
  }
  handleAddComment() {
    const { discussionId, request, setLoading, clearLoading } = this.props;
    const { message, attachments } = this.state;

    if (!message || !message.length) {
      return;
    }

    setLoading('commenting');

    request('comment.add', {
      discussion_id: discussionId,
      attachments,
      message,
    }).then((res) => {
      clearLoading('commenting');

      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
      }
    })

    this.setState({ message: '', attachments: fromJS([]) });
    Keyboard.dismiss();
  }
  focusInput() {
    const input = getDeep(this, 'refs.input.refs.expandingTextInput');

    if (!this.isFocused && input) {
      input.focus();
    }
  }
  renderBackButton() {
    if (Platform.OS === 'android') {
      return undefined;
    }

    return (
      <RippleButton onPress={this.onNavigateBack}>
        <SW.BackButton>
          <Icon icon="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
        </SW.BackButton>
      </RippleButton>
    );
  }
  renderSendButton() {
    const { isLoading } = this.props;

    if (isLoading('commenting')) {
      return (
        <SW.IconButton>
          <ActivityIndicator color={colors.blue100} />
        </SW.IconButton>
      );
    }

    return (
      <SW.IconButton>
        <RippleButton rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
          <SW.IconButton>
            <Icon icon="Send" width="24" height="24" fill={gs.colors.blue100} />
          </SW.IconButton>
        </RippleButton>
      </SW.IconButton>
    );
  }


  render() {
    const { placeholder } = this.props;
    const { attachments } = this.state;

    return (
      <SW.Wrapper>
        {this.renderBackButton()}
        <TouchableWithoutFeedback onPress={this.focusInput}>
          <SW.InputWrapper>
            <SW.InputBorder>
              <ExpandingTextInput
                ref="input"
                onChangeText={message => this.setState({ message })}
                style={styles.input}
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                autoCorrect
                placeholder={placeholder}
                minRows={1}
                maxRows={4}
                value={this.state.message}
                onFocus={() => { this.isFocused = true; }}
                onBlur={() => { this.isFocused = false; }}
              />
              <AttachButton
                numberOfAttachments={attachments.size}
                delegate={this}
              />
            </SW.InputBorder>
          </SW.InputWrapper>
        </TouchableWithoutFeedback>
        <SW.Actions>
          {this.renderSendButton()}
        </SW.Actions>
      </SW.Wrapper>
    );
  }
}

