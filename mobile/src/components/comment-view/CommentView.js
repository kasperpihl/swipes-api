import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Platform, UIManager, LayoutAnimation, TouchableWithoutFeedback } from "react-native";
import ParsedText from "react-native-parsed-text";

import { setupDelegate, attachmentIconForService } from "swipes-core-js/classes/utils";
import { timeAgo } from "swipes-core-js/classes/time-utils";
import { colors, viewSize } from "globalStyles";
import * as gs from 'styles';
import Icon from "Icon";
import RippleButton from "RippleButton";
import Reactions from "../reactions/Reactions";

const styles = StyleSheet.create({
  wrapper: {
    ...gs.mixins.size(1),
  },
  container: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row'),
    marginTop: 21,
  },
  content: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'between', 'top'),
  },
  profilePicWrapper: {
    ...gs.mixins.size(42),
    borderRadius: 42 / 2,
    marginRight: 12,
  },
  profilePic: {
    ...gs.mixins.size(42),
    borderRadius: 42 / 2,
  },
  initials: {
    ...gs.mixins.size(42),
    ...gs.mixins.flex('center'),
    borderRadius: 42 / 2,
    backgroundColor: colors.deepBlue100,
    marginRight: 12,
  },
  initialsLabel: {
    ...gs.mixins.font(28, gs.colors.bgColor),
  },
  nameWrapper: {
  },
  nameLabel: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, 18, '500'),
  },
  messageWrapper: {
    ...gs.mixins.padding(12, 18),
    ...gs.mixins.size(1),
    backgroundColor: colors.deepBlue5,
    borderRadius: 18,
  },
  message: {
    ...gs.mixins.font(13, gs.colors.deepBlue100, 18),
    alignSelf: 'flex-start'
  },
  url: {
    ...gs.mixins.font(12, gs.colors.blue100, 15),
  },
  actions: {
    ...gs.mixins.flex('row', 'center'),
    paddingTop: 6,
  },
  timestamp: {
    fontSize: 12,
  },
  attachments: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
  attachment: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.border(1, gs.colors.deepBlue10),
    marginBottom: 3,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  attachmentLabel: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(12, gs.colors.deepBlue80, '500'),
    paddingLeft: 12,
  },
  reactionsWrapper: {
    ...gs.mixins.flex('row', 'center', 'center'),
    width: 50,
    flex: 0,
    marginRight: -15,
  },
  timestamp: {
    paddingLeft: 54,
  },
  timestampLabel: {
    ...gs.mixins.font(12, colors.deepBlue50),
    ...gs.mixins.padding(9, 6),
  }
});

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentActive: false
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.handleActiveState = this.handleActiveState.bind(this);
    this.disableActiveState = this.disableActiveState.bind(this);

    setupDelegate(this, 'onOpenUrl', 'onAttachmentClick')
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  disableActiveState() {
    const { commentActive } = this.state;

    if (commentActive) this.setState({ commentActive: false })
  }
  handleActiveState() {
    const { commentActive } = this.state;

    this.setState({ commentActive: !commentActive })
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
        <Text selectable={true} style={styles.nameLabel}>
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
    const { commentActive } = this.state;
    const name = msgGen.users.getFullName(comment.get("created_by"));
    const message = `<!${comment.get("created_by")}|${name}> ` + comment.get("message");
    let extraStyles = {};

    if (commentActive) {
      extraStyles = {
        backgroundColor: colors.deepBlue20
      }
    }

    return (
      <View style={[styles.messageWrapper, extraStyles]}>
        <ParsedText
          style={styles.message}
          selectable={true}
          parse={[
            { type: "url", style: styles.url, onPress: this.onOpenUrl },
            { pattern: /<!([A-Z0-9]*)\|(.*?)>/i, style: styles.nameLabel, renderText: this.renderText},
          ]}
        >
          {message}
        </ParsedText>
        {this.renderAttachments()}
      </View>
    );
  }
  renderTimestamp() {
    const { comment } = this.props;
    const { commentActive } = this.state;
    const timestamp = timeAgo(comment.get("created_at"), true);

    if (commentActive) {
      return (
        <View style={styles.timestamp}>
          <Text style={styles.timestampLabel}>
            {timestamp}
          </Text>
        </View>
      )
    }

    return undefined;

  }
  renderReactions() {
    const { comment, delegate } = this.props;

    return (
      <View style={styles.reactionsWrapper} >
        <Reactions
          reactions={comment.get("reactions")}
          delegate={delegate}
          commentId={comment.get("id")}
          height={42}
        />
      </View>
    )
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
  renderSubLine() {
    const { comment, delegate, loadingReaction } = this.props;

    return (
      <View style={styles.actions}>
        <Reactions
          reactions={comment.get("reactions")}
          delegate={delegate}
          commentId={comment.get("id")}
        >
        </Reactions>
        <View>
          <Text selectable={true} style={styles.timestamp}>
            {"  "} • {"  "}{timestamp}
          </Text>
        </View>
      </View>
    );
  }
  render() {
    const { comment } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.disableActiveState} onLongPress={this.handleActiveState}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            {this.renderProfilePic()}
            {this.renderMessage()}
            {this.renderReactions()}
          </View>
          {this.renderTimestamp()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default CommentView;
// const { string } = PropTypes;
CommentView.propTypes = {};
