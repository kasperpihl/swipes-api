import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate, setupCachedCallback, attachmentIconForService } from '../../../swipes-core-js/classes/utils';
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
      <Text style={styles.message}>{n.get('message')}</Text>
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
        <RippleButton key={`attachment-${i}`} onPress={this.onAttachmentClick(att)}>
          <View style={styles.attachment}>
            <Icon
              name={iconName}
              width="24"
              height="24"
              fill={colors.blue100}
            />
            <Text style={styles.attachmentTitle} numberOfLines={1}>{att.get('title')}</Text>
          </View>
        </RippleButton>
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
  renderTimestamp() {
    const { notification: n } = this.props;

    if (!n.get('timeago')) {
      return undefined;
    }

    return (
      <View style={styles.topRight}>
        <Text style={styles.timestamp}>{n.get('timeago')}</Text>
      </View>
    );
  }
  renderReplyButton() {
    const { notification: n } = this.props;

    if (n.get('reply')) {
      return (
        <RippleButton style={styles.replyButton} onPress={this.onReplyTo(n)}>
          <View style={styles.replyButton}>
            <Icon name="Reply" width="24" height="24" fill={colors.deepBlue50} />
            <Text style={styles.replyButtonLabel}>Reply</Text>
          </View>
        </RippleButton>
      );
    }

    return undefined;
  }
  render() {
    const { notification: n } = this.props;

    return (
      <View style={styles.container}>
        <RippleButton onPress={this.onNotificationPress(n)} onLongPress={this.onNotificationLongPress(n)}>
          <View style={styles.topSection}>
            {this.renderIcon()}
            {this.renderContent()}
            {this.renderTimestamp()}
          </View>
        </RippleButton>

        <View style={styles.bottomSection}>
          {this.renderAttachments()}
        </View>
        {this.renderReplyButton()}
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
    paddingTop: 18,
    paddingBottom: 12,
  },
  bottomSection: {

  },
  iconRead: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepBlue30,
    borderRadius: 18,
  },
  iconUnread: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue100,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 12,
    color: colors.deepBlue60,
    marginBottom: 12,
    lineHeight: 15,
  },
  title: {
    fontSize: 15,
    color: colors.deepBlue100,
    fontWeight: '500',
    lineHeight: 21,
  },
  message: {
    flexWrap: 'wrap',
    fontSize: 15,
    color: colors.deepBlue70,
    lineHeight: 21,
  },
  timestamp: {
    fontSize: 12,
    color: colors.deepBlue60,
    lineHeight: 15,
  },
  attachments: {
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue5,
    marginLeft: 55,
    marginRight: 15,
    paddingTop: 7.5,
    paddingBottom: 10.5,
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7.5,
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
    width: viewSize.width - 30,
    marginLeft: 15,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue5,
  },
  replyButtonLabel: {
    color: colors.deepBlue50,
    paddingLeft: 9,
  },
});

export default NotificationItem;
