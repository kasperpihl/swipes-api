import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Platform, UIManager, LayoutAnimation } from "react-native";
import ParsedText from "react-native-parsed-text";
import { setupDelegate } from "../../../swipes-core-js/classes/utils";
import { timeAgo } from "../../../swipes-core-js/classes/time-utils";
import Reactions from "../reactions/Reactions";
import { colors, viewSize } from "../../utils/globalStyles";

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
    paddingTop: 6,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: -4,
  }
});

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    setupDelegate(this, 'onOpenUrl')
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
  renderMessage() {
    const { comment } = this.props;
    const message = comment.get("message");

    return (
      <View style={styles.messageWrapper}>
        <ParsedText
          style={styles.message}
          parse={[{ type: "url", style: styles.url, onPress: this.onOpenUrl }]}
        >
          {message}
        </ParsedText>
      </View>
    );
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
          <Text style={styles.timestamp}>
            {" "} • {timestamp}
          </Text>
        </Reactions>
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
          {this.renderSubLine()}
        </View>
      </View>
    )
  }
}

export default CommentView;
// const { string } = PropTypes;
CommentView.propTypes = {};
