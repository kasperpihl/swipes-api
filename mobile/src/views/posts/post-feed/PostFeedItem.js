import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { setupDelegate } from '../../../../swipes-core-js/classes/utils';
import { timeAgo } from '../../../../swipes-core-js/classes/time-utils';
import { colors, viewSize } from '../../../utils/globalStyles';
import HOCHeader from '../../../components/header/HOCHeader';
import StyledText from '../../../components/styled-text/StyledText';
import Icon from '../../../components/icons/Icon';
import RippleButton from '../../../components/ripple-button/RippleButton';

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
  }
});

class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this);
    this.callDelegate.bindAll('onOpenUrl', 'onAddReaction');
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
    const icon = post.get('context') ? <Icon name="Goals" width="12" height="12" fill={colors.deepBlue40} /> : undefined;
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
  renderActions() {
    const { post } = this.props;
    const myId = msgGen.users.getUser('me').get('id');
    const commentSize = post.get('comments').size;
    const reactionsSize = post.get('reactions').size;
    const iLike = !!post.get('reactions').find(r => r.get('created_by') === myId);
    const heartColor = iLike ? colors.red80 : colors.deepBlue100;

    return (
      <View>
        <View>
          <RippleButton onPress={this.onAddReactionCached(post.get('id'), iLike)}>
            <View>
              <Icon name="Heart" width="24" height="24" fill={heartColor} />

              <Text>Like</Text>
            </View>
          </RippleButton>
          <Text>
            {reactionsSize}
          </Text>
        </View>

        <RippleButton>
          <View>
            <Text>
              {commentSize} Comments
            </Text>
          </View>
        </RippleButton>
      </View>
    )
  }
  renderSeperator() {

    return (
      <View style={styles.seperator} />
    )
  }
  render() {
    const { post } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderMessage()}
        {this.renderActions()}
        {this.renderSeperator()}
      </View>
    );
  }
}

export default PostFeed;
