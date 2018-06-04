import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Keyboard, UIManager, LayoutAnimation, InteractionManager } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { List } from 'immutable';
import { setupDelegate } from 'react-delegate';
import { iconForId, attachmentIconForService, bindAll } from 'swipes-core-js/classes/utils';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import { colors, viewSize, statusbarHeight } from 'globalStyles';
import HOCHeader from 'HOCHeader';
import StyledText from 'components/styled-text/StyledText';
import Icon from 'Icon';
import * as gs from 'styles';
import RippleButton from 'RippleButton';
import Reactions from 'components/reactions/Reactions';
import CommentView from 'components/comment-view/CommentView';
import WaitForUI from 'WaitForUI';
import PostFooter from './PostFooter';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(1),
    alignSelf: 'stretch',
  },
  header: {
    ...gs.mixins.flex('row'),
    ...gs.mixins.padding(50, 15, 11, 15),
    ...gs.mixins.border(1, gs.colors.deepBlue20, 'bottom'),
    alignSelf: 'stretch',
  },
  headerSide: {
    ...gs.mixins.size(1),
    paddingLeft: 12,
  },
  profilePicWrapper: {
    ...gs.mixins.size(54),
    borderRadius: 54 / 2,
  },
  profilePic: {
    ...gs.mixins.size(54),
    borderRadius: 54 / 2,
  },
  initials: {
    ...gs.mixins.size(54),
    ...gs.mixins.flex('center'),
    backgroundColor: colors.deepBlue100,
    borderRadius: 54 / 2,
  },
  initialsLabel: {
    ...gs.mixins.font(28, 'white'),
    backgroundColor: 'transparent',
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
    ...gs.mixins.flex('row', 'right'),
    alignSelf: 'stretch',
    height: 54,
    paddingRight: 15,
  },
  actionsSeperator: {
    ...gs.mixins.size(viewSize.width - 30, 1),
    backgroundColor: colors.deepBlue10,
    position: 'absolute',
    left: 15,
    top: 0,
  },
  comments: {
    ...gs.mixins.padding(0, 15, 21, 15),
  },
  navButton: {
    ...gs.mixins.flex('center'),
    paddingLeft: 6,
  },
  navButtonLabel: {
    ...gs.mixins.font(12, gs.colors.deepBlue50, 15),
    paddingRight: 6,
  },
  attachments: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
  attachment: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.border(1, gs.colors.deepBlue10),
    ...gs.mixins.borderRadius(6),
    height: 48,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  attachmentLabel: {
    ...gs.mixins.font(12, gs.colors.deepBlue80, '500'),
    paddingLeft: 12,
  },
  reactionWrapper: {
    ...gs.mixins.size(75, 54),
    ...gs.mixins.flex('row', 'right', 'top'),
    marginRight: -15,
    flex: 0,
  },
});

class PostView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapseHeader: false,
      headerHeight: 0,
    };

    bindAll(this, ['onHeaderTap', 'keyboardShow', 'keyboardHide', 'scrollToBottom']);
    setupDelegate(this, 'onOpenUrl', 'onAddReaction', 'onNavigateToContext', 'onAttachmentClick');

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillMount() {
    if (this.props.initialScrollToBottom) {
      this.shouldScrollToBottom = true;
    }
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    this.keyboardShowListener = Keyboard.addListener(showEvent, this.keyboardShow);
    this.keyboardHideListener = Keyboard.addListener(hideEvent, this.keyboardHide);
  }

  componentWillUpdate(nextProps) {
    // LayoutAnimation.easeInEaseOut();

    if (this.props.post.get('comments').size !== nextProps.post.get('comments').size) {
      this.shouldScrollToBottom = true;
    }
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentWillUnmount() {
    if (this.interactionHandle) this.interactionHandle.cancel();
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }
  keyboardShow() {
    this.setState({ collapseHeader: true });
  }
  keyboardHide() {
    this.setState({ collapseHeader: false });
  }
  measureView(event) {
    this.getHeaderHeight(event.nativeEvent.layout.height);
  }
  getHeaderHeight(height) {
    const { headerHeight } = this.state;

    if (headerHeight !== height) {
      this.setState({ headerHeight: height });
    }
  }
  scrollToBottom() {
    if (this.interactionHandle) this.interactionHandle.cancel();
    this.interactionHandle = InteractionManager.runAfterInteractions(() => {
      if (this.shouldScrollToBottom && this.refs.scrollView) {
        this.shouldScrollToBottom = false;
        this.refs.scrollView.scrollToEnd({ animated: true });
      }
    });
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  }
  renderGeneratedTitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    const string = [
      {
        id: post.get('created_by'),
        string: msgGen.users.getFirstName(post.get('created_by')),
        boldStyle: styles.boldStyle,
      },
      ' ',
      msgGen.posts.getPostTypeTitle(type),
    ];

    const taggedUsers = post.get('tagged_users');
    if (taggedUsers.size) {
      string.push(' and tagged ');
      taggedUsers.forEach((id, i) => {
        if (i > 0) {
          string.push(i === taggedUsers.size - 1 ? ' and ' : ', ');
        }
        string.push({
          id,
          string: msgGen.users.getFirstName(id),
          boldStyle: styles.boldStyle,
        });
      });
    }

    return <StyledText text={string} textStyle={styles.textStyle} />;
  }
  renderProfilePic() {
    const { post } = this.props;
    const image = msgGen.users.getPhoto(post.get('created_by'));
    const initials = msgGen.users.getInitials(post.get('created_by'));

    if (!image) {
      return (
        <View style={styles.initials}>
          <Text selectable style={styles.initialsLabel}>
            {initials}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.profilePicWrapper}>
        <Image source={{ uri: image }} style={styles.profilePic} />
      </View>
    );
  }
  renderHeaderSubtitle() {
    const { post } = this.props;
    const timeStamp = timeAgo(post.get('created_at'), true);
    const seperator = post.get('context')
      ? <Text selectable style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text>
      : undefined;
    const contextTitle = post.get('context')
      ? (<Text selectable style={styles.subtitleLabel}>
        {post.getIn(['context', 'title'])}
      </Text>)
      : undefined;
    const icon = post.get('context')
      ? <Icon icon={iconForId(post.getIn(['context', 'id']))} width="12" height="12" fill={colors.deepBlue40} />
      : undefined;
    const padding = post.get('context') ? 5 : 0;

    return (
      <View style={styles.subtitle}>
        {icon}
        <Text selectable style={[styles.subtitleTextWrapper, { paddingLeft: padding }]}>
          {contextTitle}
          {seperator}
          <Text selectable style={styles.subtitleLabel}>
            {timeStamp}
          </Text>
        </Text>
      </View>
    );
  }
  renderPostHeader() {
    const { headerHeight, collapseHeader } = this.state;

    let marginTop = 0;
    // let opacity = 1;
    let paddingBottom = 0;

    if (collapseHeader) {
      marginTop = -headerHeight + statusbarHeight;
      paddingBottom = statusbarHeight;

      if (Platform.OS === 'ios') {
        // opacity = 0;
      }
    }

    return (
      <View style={{ marginTop, paddingBottom }} onLayout={event => this.measureView(event)}>
        <RippleButton onPress={this.onHeaderTap}>
          <View style={styles.header}>
            {this.renderProfilePic()}
            <View style={styles.headerSide}>
              {this.renderGeneratedTitle()}
              {this.renderHeaderSubtitle()}
            </View>
          </View>
        </RippleButton>
      </View>
    );
  }
  renderMessage() {
    const { post, delegate } = this.props;
    const message = post.get('message');

    return (
      <View style={styles.messageWrapper}>
        <ParsedText
          style={styles.message}
          parse={[{ type: 'url', style: styles.url, onPress: this.onOpenUrl }]}
        >
          {message}
        </ParsedText>
        <View style={styles.reactionWrapper}>
          <Reactions
            reactions={post.get('reactions')}
            post={post}
            delegate={delegate}
          />
        </View>
      </View>
    );
  }
  renderAttachments() {
    const { post } = this.props;

    if (!post.get('attachments').size) {
      return undefined;
    }

    const attachments = post.get('attachments').map((att, i) => (
      <RippleButton onPress={this.onAttachmentClickCached(i, post)} key={i}>
        <View style={styles.attachment}>
          <Icon
            icon={attachmentIconForService(att.getIn(['link', 'service']))}
            width="24"
            height="24"
            fill={colors.deepBlue80}
          />
          <Text selectable style={styles.attachmentLabel} numberOfLines={1} ellipsizeMode="tail">{att.get('title')}</Text>
        </View>
      </RippleButton>
    ));

    return (
      <View style={styles.attachments}>
        {attachments}
      </View>
    );
  }
  renderOpenContextButton() {
    const { post } = this.props;
    const context = post.get('context');

    if (!context) {
      return undefined;
    }

    const title = context.get('title');
    const newTitle = title.length > 10 ? `${title.slice(0, 9) }...` : title;

    return (
      <RippleButton style={styles.navButton} onPress={this.onNavigateToContext}>
        <View style={styles.navButton}>
          <Text selectable style={styles.navButtonLabel}>Open "{newTitle}"</Text>
          <Icon icon="ArrowRightLine" width="24" height="24" fill={colors.deepBlue50} />
        </View>
      </RippleButton>
    );
  }
  renderActions() {
    const { post, delegate } = this.props;

    return (
      <View style={styles.actions}>
        <View style={styles.actionsSeperator} />
        {this.renderOpenContextButton()}
      </View>
    );
  }
  renderComments() {
    const { post, delegate } = this.props;
    const comments = post.get('comments');

    let renderComments;

    if (comments && comments.size) {
      const sortedComments = comments.toList().sort((a, b) => a.get('created_at').localeCompare(b.get('created_at')));

      renderComments = sortedComments.map((c, i) =>
        (<CommentView
          isLast={i === comments.size - 1}
          comment={c}
          key={c.get('id')}
          delegate={delegate}
        />),
      ).toArray();
    }

    return (
      <View style={styles.comments}>
        {renderComments}
      </View>
    );
  }
  renderContent() {
    return (
      <WaitForUI onRendered={this.scrollToBottom}>
        <ScrollView
          style={{ flex: 1 }}
          ref="scrollView"
          onContentSizeChange={() => {
            this.shouldScrollToBottom = true;
            this.scrollToBottom();
          }}
          onLayout={(e) => {
            this.shouldScrollToBottom = true;
            this.scrollToBottom();
          }}
        >
          {this.renderMessage()}
          {this.renderAttachments()}
          {this.renderActions()}
          {this.renderComments()}
        </ScrollView>
      </WaitForUI>
    );
  }
  render() {
    const { delegate, bindLoading } = this.props;


    return (
      <View style={styles.container}>
        {this.renderPostHeader()}
        {this.renderContent()}
        <PostFooter
          ref="postFooter"
          navPush={this.props.navPush}
          onFocus={this.scrollToBottom}
          delegate={delegate}
          placeholder="Write a comment…"
          {...bindLoading()}
        />
      </View>
    );
  }
}

export default PostView;
// const { string } = PropTypes;
PostView.propTypes = {};
