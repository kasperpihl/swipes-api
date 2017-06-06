import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate, setupCachedCallback, attachmentIconForService } from '../../../swipes-core-js/classes/utils';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';

import { colors, viewSize } from '../../utils/globalStyles';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this);
    this.onAttachmentClick = setupCachedCallback(this.callDelegate.bind(null, 'openLink'));
    this.onNotificationPress = setupCachedCallback(this.callDelegate.bind(null, 'onNotificationPress'));
    this.onNotificationLongPress = setupCachedCallback(this.callDelegate.bind(null, 'onNotificationLongPress'));
    this.onReplyTo = setupCachedCallback(this.callDelegate.bind(null, 'onReply'));
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }

    const iconStyles = n.get('unseen') ? styles.iconUnread : styles.iconRead;

    return (
      <View style={iconStyles}>
        <Icon name={n.get('icon')} width="24" height="24" fill="white" />
      </View>
    );
  }
  renderMessage() {
    const { notification: n } = this.props;

    if (!n.get('message')) {
      return undefined;
    }

    return (
      <Text style={styles.message}>&bdquo;{n.get('message')}&ldquo;</Text>
    );
  }
  renderAttachments() {
    const { notification: n } = this.props;
    const attachments = n.get('attachments');

    if (!attachments || !attachments.size) {
      return undefined;
    }

    const HTMLAttachments = attachments.map((att, i) => {
      const iconName = attachmentIconForService(att.getIn(['link', 'service']) || att);

      return (
        <FeedbackButton key={`attachment-${i}`} onPress={this.onAttachmentClick(att)}>
          <View style={styles.attachment}>
            <Icon
              name={iconName}
              width="24"
              height="24"
              fill={colors.blue100}
            />
            <Text style={styles.attachmentTitle} numberOfLines={1}>{att.get('title')}</Text>
          </View>
        </FeedbackButton>
      );
    });

    const attachmentStyles = n.get('icon') ? styles.attachments : styles.smallAttachments;

    return (
      <View style={attachmentStyles}>
        {HTMLAttachments}
      </View>
    );
  }
  renderTitle(title) {
    if (!title) {
      return undefined;
    }

    if (!Array.isArray(title)) {
      title = [title];
    }

    return title.map((t, i) => (
      <Text key={i} style={styles.title}>{t}</Text>
    ));
  }
  renderContent() {
    const { notification: n } = this.props;

    return (
      <View style={styles.content}>
        {this.renderTitle(n.get('title'))}
        <Text style={styles.subtitle}>{n.get('subtitle')}</Text>
        {this.renderMessage()}
      </View>
    );
  }
  renderReplyButton() {
    const { notification: n } = this.props;

    if (n.get('reply')) {
      return (
        <RippleButton style={styles.replyButton} rippleColor={colors.blue100} rippleOpacity={0.8} onPress={this.onReplyTo(n)}>
          <View style={styles.replyButton}>
            <Text style={styles.replyButtonLabel}>Reply</Text>
          </View>
        </RippleButton>
      );
    }

    return undefined;
  }
  renderTimestamp() {
    const { notification: n } = this.props;

    if (!n.get('timeago')) {
      return undefined;
    }

    return (
      <View style={styles.topRight}>
        <Text style={styles.timestamp}>{n.get('timeago')}</Text>
        {this.renderReplyButton()}
      </View>
    );
  }
  render() {
    const { notification: n } = this.props;

    return (
      <View style={styles.container}>
        <FeedbackButton onPress={this.onNotificationPress(n)} onLongPress={this.onNotificationLongPress(n)}>
          <View style={styles.topSection}>
            {this.renderIcon()}
            {this.renderContent()}
            {this.renderTimestamp()}
          </View>
        </FeedbackButton>

        <View style={styles.bottomSection}>
          {this.renderAttachments()}
        </View>
        <View style={styles.seperator} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  seperator: {
    width: viewSize.width - 30,
    height: 1,
    backgroundColor: colors.deepBlue5,
    marginHorizontal: 15,
  },
  topSection: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  iconRead: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepBlue30,
    borderRadius: 50,
  },
  iconUnread: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue100,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 12,
    color: colors.deepBlue40,
    marginBottom: 15,
  },
  title: {
    fontSize: 16.5,
    color: colors.deepBlue90,
    marginTop: 3,
  },
  message: {
    flexWrap: 'wrap',
    fontSize: 13.5,
    color: colors.deepBlue50,
  },
  timestamp: {
    fontSize: 12,
    color: colors.deepBlue40,
  },
  attachments: {
    paddingBottom: 18,
  },
  smallAttachments: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 55,
  },
  attachmentTitle: {
    paddingLeft: 9,
    color: colors.blue100,
    fontSize: 13,
  },
  topRight: {
    width: 50,
    height: 66,
    alignItems: 'flex-end',
  },
  replyButton: {
    width: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyButtonLabel: {
    color: colors.blue100,
  },
});

export default NotificationItem;
