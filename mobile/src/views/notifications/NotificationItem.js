import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import { colors, viewSize } from 'globalStyles';
import RippleButton from 'RippleButton';
import StyledText from 'components/styled-text/StyledText';
import Icon from 'Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue10,
  },
  topSection: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    width: 66,
    height: 66,
  },
  profilePic: {
    width: 66,
    height: 66,
  },
  initials: {
    width: 66,
    height: 66,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
  },
  textStyle: {
    color: colors.deepBlue100,
    fontSize: 13,
    lineHeight: 15,
  },
  boldStyle: {
    fontWeight: 'bold',
    color: colors.deepBlue100,
    fontSize: 13,
    lineHeight: 15,
  },
  timestampWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 3,
  },
  timestampLabel: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 3,
    color: colors.deepBlue40,
  }
});

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onNotificationOpen');
  }
  getIconForType(n) {
    const type = n.getIn(['meta', 'type']);

    switch (type) {
      case 'message': return 'MessageColored';
      case 'question': return 'QuestionColored';
      case 'announcement': return 'AnnouncementColored';
      case 'information': return 'InformationColored';
      default: return 'MessageColored';
    }
  }
  renderProfilePic() {
    const { notification: n } = this.props;
    const userId = msgGen.notifications.getImportantUserIdFromMeta(n.get('meta'));
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (!image) {
      return (
        <View style={styles.initials}>
          <Text style={styles.initialsLabel}>
            {initials}
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.profilePicWrapper}>
        <Image source={{ uri: image }} style={styles.profilePic} />
      </View>
    )
  }
  renderMessage() {
    const { notification: n } = this.props;
    const text = msgGen.notifications.getStyledTextForNotification(n, styles.boldStyle);

    return (
      <View>
        <StyledText text={text} textStyle={styles.textStyle} />
      </View>
    )
  }
  renderTimestamp() {
    const { notification: n } = this.props;
    const timestamp = timeAgo(n.get('created_at'), true)
    const icon = this.getIconForType(n);

    return (
      <View style={styles.timestampWrapper}>
        <Icon name={icon} width="24" height="24" />
        <Text style={styles.timestampLabel}>{timestamp}</Text>
      </View>
    )
  }
  renderContent() {
    const { notification: n } = this.props;

    return (
      <View style={styles.content}>
        {this.renderMessage()}
        {this.renderTimestamp()}
      </View>
    );
  }
  render() {
    const { notification: n } = this.props;
    const backgroundColor = n.get('seen_at') ? colors.bgColor : colors.blue5;

    return (
      <View style={styles.container}>
        <RippleButton onPress={this.onNotificationOpenCached(n)}>
          <View style={[styles.topSection, { backgroundColor }]}>
            {this.renderProfilePic()}
            {this.renderContent()}
          </View>
        </RippleButton>
      </View>
    );
  }
}

export default NotificationItem;
