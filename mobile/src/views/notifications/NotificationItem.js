import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate } from 'react-delegate';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import { colors } from 'globalStyles';
import RippleButton from 'RippleButton';
import SplitImage from 'components/SplitImage/SplitImage';
import StyledText from 'components/styled-text/StyledText';

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
    color: 'transparent',
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
  },
});

const parseUserIds = message => (dispatch, getState) => {
  return message.replace(/<!([A-Z0-9]*)>/gi, (full, uId) => getState().users.getIn([uId, 'profile', 'first_name']));
};


@connect(null, {
  parseUserIds,
})
class NotificationItem extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onNotificationOpen');
  }
  renderProfilePic() {
    const { notification: n } = this.props;
    let users;

    if(n.get('title')) {
      users = n.get('done_by').toJS();
    } else {
      users = [msgGen.notifications.getImportantUserIdFromMeta(n.get('meta'))];
    }

    return <SplitImage userIds={users} size={40} />
  }
  renderMessage() {
    const { notification: n, parseUserIds } = this.props;

    if(n.get('title')) {
      const text = parseUserIds(n.get('title'));
      return (
        <View>
          <Text style={styles.textStyle}>{text}</Text>
        </View>
      )
    } else {
      const text = msgGen.notifications.getStyledTextForNotification(n, styles.boldStyle);
      return (
        <View>
          <StyledText text={text} textStyle={styles.textStyle} />
        </View>
      );
    }
  }
  renderTimestamp() {
    const { notification: n } = this.props;
    const timestamp = timeAgo(n.get('created_at'), true);

    return (
      <View style={styles.timestampWrapper}>
        <Text selectable style={styles.timestampLabel}>{timestamp}</Text>
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
            <View style={styles.content}>
              {this.renderMessage()}
              {this.renderTimestamp()}
            </View>
          </View>
        </RippleButton>
      </View>
    );
  }
}

export default NotificationItem;
