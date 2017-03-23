import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { attachmentIconForService } from '../../../swipes-core-js/classes/utils';
import Icon from '../../components/icons/Icon';

import { colors, viewSize } from '../../utils/globalStyles'

class NotificationItem extends Component {
  constructor() {
    super();

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }
    const iconStyles = n.get('seenAt') ? styles.iconRead : styles.iconUnread;

    return (
      <View style={iconStyles}>
        <Icon name={n.get('icon')} width="24" height="24" fill="white"/>
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

    if (!attachments.size) {
      return undefined;
    }

    const HTMLAttachments = attachments.map((att, i) => {
      const iconName = attachmentIconForService(att.getIn(['link', 'service']) || att);

      return (
        <View style={styles.attachment} key={'attachment-' + i}>
          <Icon
            name={iconName}
            width="24"
            height="24"
            fill={colors.blue100}
          />
          <Text style={styles.attachmentTitle} numberOfLines={1}>{att.get('title')}</Text>
        </View>
      )
    })

    return (
      <View style={styles.attachments}>
        {HTMLAttachments}
      </View>
    )
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
        <Text style={styles.subtitle}>{n.get('subtitle')}</Text>
        {this.renderTitle(n.get('title'))}
        {this.renderMessage()}
      </View>
    );
  }
  renderTimestamp() {
    const { notification: n } = this.props;

    if (!n.get('timeago')) {
      return undefined;
    }

    return <Text style={styles.timestamp}>{n.get('timeago')}</Text>;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          {this.renderIcon()}
          {this.renderContent()}
          {this.renderTimestamp()}
          </View>
        <View style={styles.bottomSection}>
          {this.renderAttachments()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 66,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue5
  },
  topSection: {
    flexDirection: 'row',
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
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 12,
    color: colors.deepBlue40
  },
  title: {
    fontSize: 16,
    color: colors.deepBlue90,
    marginTop: 3
  },
  message: {
    flexWrap: 'wrap',
    fontSize: 13,
    marginTop: 15,
    color: colors.deepBlue50
  },
  timestamp: {
    fontSize: 12,
    color: colors.deepBlue40
  },
  attachments: {
    paddingTop: 18,
    paddingLeft: 55
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  attachmentTitle: {
    paddingLeft: 9,
    color: colors.blue100,
    fontSize: 13,
  }
});

export default NotificationItem;