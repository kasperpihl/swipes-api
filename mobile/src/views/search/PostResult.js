import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import StyledText from 'components/styled-text/StyledText';
import Icon from 'Icon';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 12,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  headerSide: {
    flex: 1,
    paddingLeft: 12,
  },
  profilePicWrapper: {
    width: 48,
    height: 48,
    borderRadius: 3,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 3,
  },
  initials: {
    width: 48,
    height: 48,
    borderRadius: 3,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor,
  },
  textStyle: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue40,
    includeFontPadding: false,
  },
  boldStyle: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue100,
    includeFontPadding: false,
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  subtitleLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue40,
  },
  messageWrapper: {
    paddingHorizontal: 15,
    paddingTop: 21,
    paddingBottom: 18,
  },
  message: {
    fontSize: 18,
    color: colors.deepBlue100,
    lineHeight: 27,
    fontWeight: '300',
  },
  url: {
    fontSize: 18,
    color: colors.blue100,
    lineHeight: 27,
    fontWeight: '300',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
    alignSelf: 'stretch',
  },
  actionsSeperator: {
    width: viewSize.width - 30,
    height: 1,
    backgroundColor: colors.deepBlue10,
    position: 'absolute',
    left: 15, top: 0,
  },
  commentsButton: {
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionWrapper: {
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  attachments: {
    paddingHorizontal: 15,
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.deepBlue10,
  },
  attachmentLabel: {
    fontSize: 12,
    color: colors.deepBlue80,
    fontWeight: '500',
    paddingLeft: 12,
  }
});

class PostResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onOpenUrl');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  getType() {
    const { result } = this.props;
    const type = result.item.type;

    switch (type) {
      case 'announcement':
        return { label: 'Announcement', color: 'Yellow' }
      case 'question':
        return { label: 'Question', color: 'Purple' }
      case 'information':
        return { label: 'Information', color: 'Blue' }
      case 'post':
      default:
        return { label: 'Post', color: 'Green' }
    }
  }
  renderProfileImage() {
    const { result } = this.props;
    const userId = result.item.created_by;
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (image) {
      return <Image source={{ uri: image }}  />
    }

    return (
      <View>
        <Text>
          {initials}
        </Text>
      </View>
    )
  }
  renderGeneratedTitle() {
    const { result } = this.props;
    const { item } = result;
    const type = item.type;

    let string = [
      {
        id: item.created_by,
        string: msgGen.users.getFirstName(item.created_by, ),
        boldStyle: styles.boldStyle
      },
      ' ',
      msgGen.posts.getPostTypeTitle(type)
    ];

    const taggedUsers = item.tagged_users;

    if (taggedUsers.size) {
      string.push(' and tagged ');

      taggedUsers.forEach((id, i) => {

        if (i > 0) {
          string.push(i === taggedUsers.size - 1 ? ' and ' : ', ');
        }

        string.push({
          id,
          string: msgGen.users.getFirstName(id),
          boldStyle: styles.boldStyle
        });
      });
    }

    return (
      <StyledText
        text={string}
        textStyle={styles.textStyle}
      />
    )
  }
  renderSubtitle() {
    const { result } = this.props;
    const { item: post } = result;
    const timeStamp = timeAgo(post.created_at, true);
    const seperator = post.context ? <Text style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text> : undefined;
    const contextTitle = post.context ? <Text style={styles.subtitleLabel}>{post.context.title}</Text> : undefined;
    const icon = post.context ? <Icon name={miniIconForId(post.context.id)} width="12" height="12" fill={colors.deepBlue40} /> : undefined;
    const padding = post.context ? 5 : 0;

    return (
      <View style={styles.subtitle}>
        {icon}
        <Text style={[styles.subtitleTextWrapper, { paddingLeft: padding }]}>
          {contextTitle}
          {seperator}
          <Text style={styles.subtitleLabel}>{timeStamp}</Text>
        </Text>
      </View>
    )
  }
  renderType() {
    const type = this.getType();
    const typeStyleColor = styles[type.color];

    return (
      <View style={[styles.typeWrapper, typeStyleColor]}>
        <Text>{type.label}</Text>
      </View>
    )
  }
  renderHeader() {

    return (
      <View style={styles.header}>
        <View style={styles.titles}>
          {this.renderGeneratedTitle()}
          {this.renderSubtitle()}
        </View>
        {this.renderType()}
      </View>
    )
  }
  renderMessage() {
    const { result } = this.props;
    const { item } = result;

    return (
      <View style={styles.messageWrapper}>
        <ParsedText
          style={styles.message}
          parse={
            [
              { type: 'url', style: styles.url, onPress: this.onOpenUrl },
            ]
          }
        >
          {item.message}
        </ParsedText>

      </View>
    )
  }
  render() {
    return (
      <View style={styles.container} >
        <View style={styles.profileImage} >
          {this.renderProfileImage()}
        </View>
        <View style={styles.rightContent} >
          {this.renderHeader()}
          {this.renderMessage()}
        </View>
      </View>
    );
  }
}

export default PostResult

// const { string } = PropTypes;

PostResult.propTypes = {};
