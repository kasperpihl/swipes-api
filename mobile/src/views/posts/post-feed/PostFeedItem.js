import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { setupDelegate, iconForId, attachmentIconForService } from '../../../../swipes-core-js/classes/utils';
import { timeAgo } from '../../../../swipes-core-js/classes/time-utils';
import { colors, viewSize } from '../../../utils/globalStyles';
import HOCHeader from '../../../components/header/HOCHeader';
import StyledText from '../../../components/styled-text/StyledText';
import Icon from '../../../components/icons/Icon';
import RippleButton from '../../../components/ripple-button/RippleButton';
import Reactions from '../../../components/reactions/Reactions';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 12,
  },
  seperator: {
    alignSelf: 'stretch',
    height: 18,
    backgroundColor: colors.deepBlue4,
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

class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onOpenUrl', 'onAddReaction', 'onOpenPost', 'onAttachmentClick');
    this.handleOpenPost = this.handleOpenPost.bind(this);
  }
  handleOpenPost() {
    const { post } = this.props;


    this.onOpenPost(post.get('id'))
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
  renderHeaderSubtitle() {
    const { post } = this.props;
    const timeStamp = timeAgo(post.get('created_at'), true);
    const seperator = post.get('context') ? <Text style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text > : undefined;
    const contextTitle = post.get('context') ? <Text style={styles.subtitleLabel}>{post.getIn(['context', 'title'])}</Text> : undefined;
    const icon = post.get('context') ? <Icon name={iconForId(post.getIn(['context', 'id']))} width="12" height="12" fill={colors.deepBlue40} /> : undefined;
    const padding = post.get('context') ? 5 : 0;

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
  renderHeader() {

    return (
      <RippleButton onPress={this.handleOpenPost}>
        <View style={styles.header}>
          {this.renderProfilePic()}
          <View style={styles.headerSide}>
            {this.renderGeneratedTitle()}
            {this.renderHeaderSubtitle()}
          </View>
        </View>
      </RippleButton>
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

    if (commentSize === 0) {
      return (
        <RippleButton style={styles.commentsButton} onPress={this.handleOpenPost}>
          <View style={styles.commentsButton}>
            <Text style={styles.commentsButtonLabel}>Write a comment</Text>
          </View>
        </RippleButton>
      )
    }

    const commentsString = commentSize > 1 ? `${commentSize} Comments` : `${commentSize} Comment`;

    return (
      <RippleButton style={styles.commentsButton} onPress={this.handleOpenPost}>
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
        <View style={styles.reactionWrapper}>
          <Reactions
            reactions={post.get('reactions')}
            post={post}
            delegate={delegate}
          />
        </View>
        {this.renderComments()}
      </View>
    )
  }
  renderSeperator() {

    return (
      <View style={styles.seperator} />
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
          <Text style={styles.attachmentLabel} numberOfLines={1} ellipsizeMode="tail">{att.get('title')}</Text>
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
        {this.renderHeader()}
        {this.renderMessage()}
        {this.renderAttachments()}
        {this.renderActions()}
        {this.renderSeperator()}
      </View>
    );
  }
}

export default PostFeed;
