import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, attachmentIconForService, miniIconForId } from '../../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../../utils/globalStyles';
import HOCHeader from '../../../components/header/HOCHeader'
import RippleButton from '../../../components/ripple-button/RippleButton';
import StyledText from '../../../components/styled-text/StyledText';
import Icon from '../../../components/icons/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createHeader: {
    flex: 1,
    paddingTop: 21,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 44,
    paddingHorizontal: 15,
  },
  profilePicWrapper: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  initials: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLabel: {
    fontSize: 28,
    color: colors.bgColor,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 18,
    paddingLeft: 15,
    color: colors.deepBlue100,
    lineHeight: 21,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  styledWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 21,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textStyle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue50,
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexWrap: 'wrap', 
  },
  boldStyle: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.blue100,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.deepBlue50,
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexWrap: 'wrap', 
  },
  subtitleLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue40,
    paddingLeft: 6,
  },
  attachments: {
    paddingHorizontal: 15,
    marginTop: 21,
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
    flex: 1,
    fontSize: 12,
    color: colors.deepBlue80,
    fontWeight: '500',
    paddingLeft: 12,
  }
})

class PostCreate extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      inputHeight: 21,
    }

    setupDelegate(this, 'onMessageChange', 'onAttachmentClick');
    this.onContentSizeChange = this.onContentSizeChange.bind(this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onContentSizeChange(e) {
    const { inputHeight } = this.state;
    console.log(this.refs.input);

    if (inputHeight !== e.nativeEvent.contentSize.height) {
      this.setState({ inputHeight: e.nativeEvent.contentSize.height })
    }
  }
  renderContext() {
    const { post } = this.props;
    const context = post.get('context');

    if (!context) {
      return undefined;
    }

    return (
      [<Icon key="icon" name={miniIconForId(post.getIn(['context', 'id']))} width="18" height="18" fill={colors.deepBlue40} style={{marginTop: -2 }} />,
      <Text key="title" style={[styles.subtitle, {paddingHorizontal: 3, marginTop: -2 }]}>{post.getIn(['context', 'title'])}</Text>]
    )
  }
  renderHeader() {

    return (
      <View style={styles.header}>
        {this.renderProfilePic()}
      </View>
    )
  }
  renderProfilePic() {
    const { myId } = this.props;
    const image = msgGen.users.getPhoto(myId);
    const initials = msgGen.users.getInitials(myId);

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
  renderTextArea() {
    const { myId, post } = this.props;
    const { inputHeight} = this.state;
    const placeholder = 'What\'s on your mind?';
    const lineNumbers = parseInt(inputHeight / 21);
    const iOSInputHeight = Platform.OS === 'ios' ? { height: inputHeight } : {};

    return (
      <TextInput
        ref="input"
        numberOfLines={lineNumbers}
        multiline
        autoFocus
        onChangeText={this.onMessageChange}
        value={post.get('message')}
        autoCapitalize="sentences"
        style={[styles.input, iOSInputHeight]}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        onContentSizeChange={this.onContentSizeChange}
        scrollEnabled={false}
      />
    )
  }
  renderStyledText() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = ['— ', {
      id: 'type',
      string: msgGen.posts.getPostComposeTypeTitle(type),
      boldStyle: styles.boldStyle
    }];

    const taggedUsers = post.get('taggedUsers');
    if (taggedUsers.size) {
      string.push(' and tag ');
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
      <View style={styles.styledWrapper}>
        <View style={{ flexDirection: 'row' }}>
          {this.renderContext()}
        </View>
        <View style={{ flex: 1 }}>
          <StyledText
            text={string}
            textStyle={styles.textStyle}
          />
        </View>
      </View>
    )
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
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.createHeader, { paddingTop: 44}]}>
            {this.renderProfilePic()}
            {this.renderTextArea()}
          </View>
          {this.renderStyledText()}
          {this.renderAttachments()}
        </ScrollView>
      </View>
    )
  }
}

export default PostCreate
// const { string } = PropTypes;
PostCreate.propTypes = {};
