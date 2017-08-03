import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Platform, UIManager, LayoutAnimation } from "react-native";
import ParsedText from "react-native-parsed-text";
import { setupDelegate, attachmentIconForService } from "../../../swipes-core-js/classes/utils";
import { timeAgo } from "../../../swipes-core-js/classes/time-utils";
import Reactions from "../reactions/Reactions";
import { colors, viewSize } from "../../utils/globalStyles";
import Icon from "../icons/Icon";
import RippleButton from "../ripple-button/RippleButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: 'row',
    marginTop: 21,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
  },
  profilePicWrapper: {
    width: 36,
    height: 36,
    borderRadius: 3
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 3
  },
  initials: {
    width: 36,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.deepBlue100,
    alignItems: "center",
    justifyContent: "center"
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor
  },
  nameWrapper: {
  },
  nameLabel: {
    fontSize: 12,
    color: colors.deepBlue100,
    fontWeight: '500',
    lineHeight: 15
  },
  messageWrapper: {
    paddingTop: 3,
  },
  message: {
    fontSize: 12,
    color: colors.deepBlue100,
    lineHeight: 15,
  },
  url: {
    fontSize: 12,
    color: colors.blue100,
    lineHeight: 15,
  },
  actions: {
    flexDirection: "row",
    alignItems: 'center',
    paddingTop: 6,
  },
  timestamp: {
    fontSize: 12,
  },
  attachments: {
    paddingHorizontal: 0,
    marginTop: 3,
  },
  attachment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
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

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    setupDelegate(this, 'onOpenUrl', 'onAttachmentClick')
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderProfilePic() {
    const { comment } = this.props;
    const image = msgGen.users.getPhoto(comment.get("created_by"));
    const initials = msgGen.users.getInitials(comment.get("created_by"));

    if (!image) {
      return (
        <View style={styles.initials}>
          <Text style={styles.initialsLabel}>
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
  renderName() {
    const { comment } = this.props;
    const name = msgGen.users.getFullName(comment.get("created_by"));

    return (
      <View style={styles.nameWrapper}>
        <Text style={styles.nameLabel}>
          {name}
        </Text>
      </View>
    );
  }
  renderText(matchingString, matches) {
    return matches[2];
  }
  renderMessage() {
    const { comment } = this.props;
    const message = comment.get("message");

    return (
      <View style={styles.messageWrapper}>
        <ParsedText
          style={styles.message}
          parse={[
            { type: "url", style: styles.url, onPress: this.onOpenUrl },
            { pattern: /<!([A-Z0-9]*)\|(.*?)>/gi, style: styles.nameLabel, renderText: this.renderText},
          ]}
        >
          {message}
        </ParsedText>
      </View>
    );
  }
  renderAttachments() {
    const { comment } = this.props;

    if (!comment.get('attachments') || !comment.get('attachments').size) {
      return undefined;
    }

    const attachments = comment.get('attachments').map((att, i) => (
      <RippleButton onPress={this.onAttachmentClickCached(i, comment)} key={i}>
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
  renderSubLine() {
    const { comment, delegate, loadingReaction } = this.props;
    const timestamp = timeAgo(comment.get("created_at"), true);

    return (
      <View style={styles.actions}>
        <Reactions
          reactions={comment.get("reactions")}
          delegate={delegate}
          commentId={comment.get("id")}
        >
        </Reactions>
        <View>
          <Text style={styles.timestamp}>
            {"  "} • {"  "}{timestamp}
          </Text>
        </View>
      </View>
    );
  }
  render() {
    const { comment } = this.props;

    return (
      <View style={styles.container}>
        {this.renderProfilePic()}
        <View style={styles.content}>
          {this.renderName()}
          {this.renderMessage()}
          {this.renderAttachments()}
          {this.renderSubLine()}
        </View>

      </View>
    )
  }
}

export default CommentView;
// const { string } = PropTypes;
CommentView.propTypes = {};
