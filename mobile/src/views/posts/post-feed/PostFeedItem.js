import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { setupDelegate, miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import { colors, viewSize } from 'globalStyles';
import * as gs from 'styles';
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
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row'),
    ...gs.mixins.padding(0 ,15),
  },
  headerSide: {
    ...gs.mixins.size(1),
    paddingLeft: 12,
  },
  profilePicWrapper: {
    ...gs.mixins.size(54),
    ...gs.mixins.borderRadius(54 / 2),
  },
  profilePic: {
    ...gs.mixins.size(54),
    ...gs.mixins.borderRadius(54 / 2),
  },
  initials: {
    ...gs.mixins.size(54),
    ...gs.mixins.flex('center'),
    ...gs.mixins.borderRadius(54 / 2),
    backgroundColor: gs.colors.deepBlue100,
  },
  initialsLabel: {
    ...gs.mixins.font(28, gs.colors.bgColor),
    backgroundColor: 'transparent'
  },
  textStyle: {
    ...gs.mixins.font(13, gs.colors.deepBlue40, 18),
  },
  boldStyle: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, 18, 'bold'),
  },
  subtitle: {
    ...gs.mixins.flex('row', 'left', 'center'),
    paddingTop: 5,
  },
  subtitleLabel: {
    ...gs.mixins.font(13, gs.colors.deepBlue40, 18),
  },
  messageWrapper: {
    ...gs.mixins.padding(18, 15),
    ...gs.mixins.flex('row', 'left', 'center'),
  },
  message: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(15, gs.colors.deepBlue80, 21),
  },
  url: {
    ...gs.mixins.font(15, gs.colors.blue100, 21),
  },
  actions: {
    ...gs.mixins.flex('row', 'between', 'center'),
    alignSelf: 'stretch',
    height: 54,
  },
  actionsSeperator: {
    ...gs.mixins.size(viewSize.width - 30, 1),
    backgroundColor: gs.colors.deepBlue10,
    position: 'absolute',
    left: 15, bottom: 0,
  },
  commentsButton: {
    ...gs.mixins.flex('center'),
    ...gs.mixins.padding(0, 15),
    height: 54,
  },
  commentsButtonLabel: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, '500')
  },
  reactionWrapper: {
    ...gs.mixins.size(75, 54),
    ...gs.mixins.flex('row', 'right', 'top'),
    marginRight: -15,
    flex: 0,
  },
  attachments: {
    ...gs.mixins.padding(0, 15),
    marginBottom: 6,
  },
  attachment: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.padding(0, 12),
    ...gs.mixins.border(1, gs.colors.deepBlue10, 6),
    height: 48,
    marginBottom: 6,
  },
  attachmentLabel: {
    ...gs.mixins.font(12, gs.colors.deepBlue80, '500'),
    paddingLeft: 12,
  },
  typeWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginBottom: 6,
    paddingRight: 15,
  },
  typeLabel: {
    ...gs.mixins.padding(4, 12),
    ...gs.mixins.font(11, 'white', 'bold'),
    ...gs.mixins.borderRadius(100, 0, 0, 100),
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
    const { post, delegate } = this.props;
    const message = post.get('message');

    return (
      <View style={styles.messageWrapper}>
        <RippleButton onPress={this.handleOpenPost} style={{ flex: 1 }}>
         <View style={{ flex: 1, alignSelf: 'stretch', ...gs.mixins.flex('row', 'left', 'center') }}>
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
        </RippleButton>
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
        {this.renderComments()}
        <View style={styles.actionsSeperator} />
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
          </View>
        </RippleButton>
        {this.renderMessage()}
        {this.renderAttachments()}
        {this.renderActions()}
      </View>
    );
  }
}

export default PostFeed;
