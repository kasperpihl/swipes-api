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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue10,
  },
  headerWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 12,
  },
  headerSide: {
    flex: 1,
    paddingLeft: 12,
  },
  profileImage: {
    width: 51,
    height: 51,
  },
  profilePic: {
    width: 51,
    height: 51,
    borderRadius: 3,
  },
  initials: {
    width: 51,
    height: 51,
    borderRadius: 3,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLabel: {
    fontSize: 28,
    color: 'white',
  },
  textStyle: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue40,
    includeFontPadding: false,
  },
  boldStyle: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    color: colors.deepBlue100,
    includeFontPadding: false,
  },
  titles: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 9,
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
  typeWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 3,
    height: 24,
  },
  Yellow: {
    backgroundColor: '#ffb337',
  },
  Purple: {
    backgroundColor: '#007aff',
  },
  Blue: {
    backgroundColor: '#7900ff',
  },
  Green: {
    backgroundColor: '#1cc05d'
  },
  typeLabel: {
    fontSize: 11,
    lineHeight: 18,
    fontWeight: 'bold',
    includeFontPadding: false,
    color: 'white',
  },
  messageWrapper: {
    paddingTop: 12,
  },
  message: {
    fontSize: 15,
    color: colors.deepBlue90,
    lineHeight: 21,
  },
  url: {
    fontSize: 15,
    color: colors.blue100,
    lineHeight: 21,
  },
});

class PostResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onOpenUrl');
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
      return <Image style={styles.profilePic}  source={{ uri: image }}  />
    }

    return (
      <View style={styles.initials} >
        <Text style={styles.initialsLabel} >
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
    const seperator = post.context ? <Text selectable={true} style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text> : undefined;
    const contextTitle = post.context ? <Text selectable={true} style={styles.subtitleLabel}>{post.context.title}</Text> : undefined;
    const icon = post.context ? <Icon name={miniIconForId(post.context.id)} width="18" height="18" fill={colors.deepBlue40} /> : undefined;
    const padding = post.context ? 5 : 0;

    return (
      <View style={styles.subtitle}>
        {icon}
        <Text selectable={true} style={[styles.subtitleTextWrapper, { paddingLeft: padding }]}>
          {contextTitle}
          {seperator}
          <Text selectable={true} style={styles.subtitleLabel}>{timeStamp}</Text>
        </Text>
      </View>
    )
  }
  renderType() {
    const type = this.getType();
    const typeStyleColor = styles[type.color];

    return (
      <View style={[styles.typeWrapper, typeStyleColor]}>
        <Text style={styles.typeLabel}>{type.label.toUpperCase()}</Text>
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
      <View style={styles.container}>
        <View style={styles.headerWrapper} >
          <View style={styles.profileImage}>
            {this.renderProfileImage()}
          </View>
          {this.renderHeader()}
        </View>
        {this.renderMessage()}
      </View>
    );
  }
}

export default PostResult

// const { string } = PropTypes;

PostResult.propTypes = {};
