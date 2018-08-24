import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { StyleSheet, Platform, UIManager, TouchableWithoutFeedback } from 'react-native';
import * as a from 'actions';
import ParsedText from 'react-native-parsed-text';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import { colors } from 'globalStyles';
import * as gs from 'styles';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import SplitImage from 'components/SplitImage/SplitImage';
import Reactions from 'components/reactions/Reactions';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './CommentItem.swiss';

const styles = StyleSheet.create({
  nameLabel: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, 18, '500'),
  },
  message: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, 18),
    alignSelf: 'flex-start',
  },
  url: {
    ...gs.mixins.font(12, gs.colors.blue100, 15),
  },
});

@connect(state => ({
}), {
  browser: a.links.browser,
  preview: a.attachments.preview,
})
class CommentItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentActive: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.toggleActiveState = this.toggleActiveState.bind(this);
  }
  onOpenUrl(url) {
    const { browser } = this.props;

    browser(url);
  }
  onAttachmentClick(attachment) {
    const { preview } = this.props;

    preview(attachment);
  }
  toggleActiveState() {
    const { commentActive } = this.state;

    this.setState({ commentActive: !commentActive });
  }
  renderText(matchingString, matches) {
    return matches[2];
  }
  renderMessage() {
    const { sent_by, message } = this.props;
    const { commentActive } = this.state;
    const name = msgGen.users.getFullName(sent_by);
    const messageWithName = `<!${sent_by}|${name}> ${message}`;

    return (
      <SW.MessageWrapper active={commentActive}>
        <ParsedText
          style={styles.message}
          selectable
          parse={[
            { type: 'url', style: styles.url, onPress: (url) => this.onOpenUrl(url) },
            { pattern: /<!([A-Z0-9]*)\|(.*?)>/i, style: styles.nameLabel, renderText: this.renderText },
          ]}
        >
          {messageWithName}
        </ParsedText>
        {this.renderAttachments()}
      </SW.MessageWrapper>
    );
  }
  renderTimestamp() {
    const { sent_at } = this.props;
    const { commentActive } = this.state;

    if (commentActive) {
      return (
        <SW.TimestampWrapper>
          <SW.TimestampLabel>
            {timeGetDayOrTime(sent_at)}
          </SW.TimestampLabel>
        </SW.TimestampWrapper>
      );
    }

    return undefined;
  }
  renderReactions() {
    const { reactions, id: commentId } = this.props;

    return (
      <SW.ReactionsWrapper>
        <Reactions
          reactions={reactions}
          commentId={commentId}
        />
      </SW.ReactionsWrapper>
    );
  }
  renderAttachments() {
    const { attachments } = this.props;

    if (!attachments.length) {
      return undefined;
    }

    const attachmentsList = attachments.map((att, i) => (
      <RippleButton onPress={() => this.onAttachmentClick(fromJS(att))} key={i}>
        <SW.Attachment>
          <Icon
            icon={attachmentIconForService(att.link.service)}
            width="24"
            height="24"
            fill={colors.deepBlue80}
          />
          <SW.AttachmentLabel selectable style={styles.attachmentLabel} numberOfLines={1}>{att.title}</SW.AttachmentLabel>
        </SW.Attachment>
      </RippleButton>
    ));

    return (
      <SW.AttachmentsWrapper>
        {attachmentsList}
      </SW.AttachmentsWrapper>
    );
  }
  render() {
    const {
      sent_by,
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.toggleActiveState}>
        <SW.Wrapper>
          <SW.Container>
            <SplitImage userIds={[sent_by]} size={30} />
            {this.renderMessage()}
            {this.renderReactions()}
          </SW.Container>
          {this.renderTimestamp()}
        </SW.Wrapper>
      </TouchableWithoutFeedback>
    );
  }
}

export default CommentItem;
