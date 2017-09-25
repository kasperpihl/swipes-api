import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { setupDelegate, miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import { colors, viewSize } from 'globalStyles';
import HOCHeader from 'HOCHeader';
import StyledText from 'components/styled-text/StyledText';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import Reactions from 'components/reactions/Reactions';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 24,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  headerSide: {
    flex: 1,
    paddingLeft: 12,
  },
  profilePicWrapper: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
  },
  profilePic: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
  },
  initials: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor,
  },
  textStyle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.deepBlue40,
    includeFontPadding: false,
  },
  boldStyle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.deepBlue100,
    includeFontPadding: false,
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  subtitleLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.deepBlue40,
  },
  messageWrapper: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 18,
  },
  message: {
    fontSize: 15,
    color: colors.deepBlue80,
    lineHeight: 21,
  },
  url: {
    fontSize: 15,
    color: colors.blue100,
    lineHeight: 21,
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
    height: 54,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.deepBlue100,
    includeFontPadding: false,
  },
  reactionWrapper: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  attachments: {
    paddingHorizontal: 15,
    marginBottom: 6,
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.deepBlue10,
  },
  attachmentLabel: {
    fontSize: 12,
    color: colors.deepBlue80,
    fontWeight: '500',
    paddingLeft: 12,
  },
  typeWrapper: {
    alignSelf: 'stretch',
    marginBottom: 6,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  typeLabel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  }
});

class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onOpenUrl', 'onAddReaction', 'onOpenPost', 'onAttachmentClick');
    this.handleOpenPost = this.handleOpenPost.bind(this);
  }
  handleOpenPost(type) {
    const { post } = this.props;

    if (type === 'comments') {
     this.onOpenPost(post.get('id'), true)
    } else {
     this.onOpenPost(post.get('id'))
    }
  }
  getInfoForType(type) {

    switch (type) {
      case 'announcement':
        return { label: 'Announcement', color: '#ffb337' }
      case 'question':
        return { label: 'Question', color: '#7900ff' }
      case 'information':
        return { label: 'Information', color: '#007aff' }
      case 'post':
      default:
        return { label: 'Post', color: '#1cc05d' }
    }
  }
  renderType() {
    const { post } = this.props;
    const type = post.get('type');
    const typeInfo = this.getInfoForType(type);

    return (
      <View style={styles.typeWrapper}>
        <View>
          <Text style={[styles.typeLabel, {backgroundColor: typeInfo.color }]}>{typeInfo.label.toUpperCase()}</Text>
        </View>
      </View>
    )
  }
  renderGeneratedTitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = [
      {
        id: post.get('created_by'),
        string: msgGen.users.getFirstName(post.get('created_by')),
        boldStyle: styles.boldStyle
      },
      ' ',
      msgGen.posts.getPostTypeTitle(type)
    ];

    const taggedUsers = post.get('tagged_users');
    if (taggedUsers.size) {
      string.push(' to ');
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
    );
  }
  renderProfilePic() {
    const { post } = this.props;
    const image = msgGen.users.getPhoto(post.get('created_by'));
    const initials = msgGen.users.getInitials(post.get('created_by'));

    if (!image) {
      return (
        <View style={styles.initials}>
          <Text selectable={true} style={styles.initialsLabel}>
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
  renderHeaderSubtitle() {
    const { post } = this.props;
    const timeStamp = timeAgo(post.get('created_at'), true);
    const seperator = post.get('context') ? <Text selectable={true} style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text> : undefined;
    const contextTitle = post.get('context') ? <Text selectable={true} style={styles.subtitleLabel}>{post.getIn(['context', 'title'])}</Text> : undefined;
    const icon = post.get('context') ? <Icon name={miniIconForId(post.getIn(['context', 'id']))} width="12" height="12" fill={colors.deepBlue40} /> : undefined;
    const padding = post.get('context') ? 5 : 0;

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
  renderHeader() {

    return (
      <View style={styles.header}>
        {this.renderProfilePic()}
        <View style={styles.headerSide}>
          {this.renderGeneratedTitle()}
          {this.renderHeaderSubtitle()}
        </View>
      </View>
    )
  }
  renderMessage() {
    const { post } = this.props;
    const message = post.get('message');

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
          {message}
        </ParsedText>

      </View>
    )
  }
  renderComments() {
    const { post } = this.props;
    const commentSize = post.get('comments').size;
    let commentsString = commentsString = 'Write a comment';


    if (commentSize > 0) {
      commentsString = commentSize > 1 ? `${commentSize} Comments` : `${commentSize} Comment`;
    }

    return (
      <RippleButton style={styles.commentsButton} onPress={this.onOpenPostCached(post.get('id'), true)}>
        <View style={styles.commentsButton}>
          <Text style={styles.commentsButtonLabel}>{commentsString}</Text>
        </View>
      </RippleButton>
    )
  }
  renderActions() {
    const { post, delegate } = this.props;

    return (
      <View style={styles.actions}>
        <View style={styles.actionsSeperator} />
        {this.renderComments()}
        <View style={styles.reactionWrapper}>
          <Reactions
            reactions={post.get('reactions')}
            post={post}
            delegate={delegate}
          />
        </View>
      </View>
    )
  }
  renderAttachments() {
    const { post } = this.props;

    const attachments = post.get('attachments').map((att, i) => (
      <RippleButton onPress={this.onAttachmentClickCached(i, post)} key={i}>
        <View style={styles.attachment}>
          <Icon
            name={attachmentIconForService(att.getIn(['link', 'service']))}
            width="24"
            height="24"
            fill={colors.deepBlue80}
          />
          <Text selectable={true} style={styles.attachmentLabel} numberOfLines={1} ellipsizeMode="tail">{att.get('title')}</Text>
        </View>
      </RippleButton>
    ))

    return (
      <View style={styles.attachments}>
        {attachments}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <RippleButton onPress={this.handleOpenPost}>
          <View>
            {this.renderType()}
            {this.renderHeader()}
            {this.renderMessage()}
          </View>
        </RippleButton>
        {this.renderAttachments()}
        {this.renderActions()}
      </View>
    );
  }
}

export default PostFeed;
