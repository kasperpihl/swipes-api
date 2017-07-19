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
import { setupDelegate } from '../../../../swipes-core-js/classes/utils';
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
    paddingTop: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
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
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    paddingLeft: 15,
    fontSize: 15,
    color: colors.deepBlue100,
    lineHeight: 21,
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        height: 25 * 5,
      },
    }),
  },
  actionButtons: {
    position: 'absolute',
    width: viewSize.width,
    height: 54,
    left: 0, bottom: 0,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    height: 36,
    paddingLeft: 9,
    paddingRight: 15,
    flexDirection: 'row',
    backgroundColor: colors.blue5,
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4.5,
    overflow: 'hidden',
  },
  actionButtonLabel: {
    fontSize: 15,
    color: colors.deepBlue70,
    paddingLeft: 6,
    includeFontPadding: false,
    paddingTop: 1,
  },
  styledWrapper: {
    flex: 1,
    paddingLeft: 78,
    paddingRight: 15,
  },
  boldStyle: {
    color: colors.deepBlue100
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
  subtitleLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue40,
    paddingLeft: 6,
  },
})

class PostCreate extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }

    setupDelegate(this, 'onMessageChange', 'onTag', 'onChangeType');
    this.handleTagging = this.handleTagging.bind(this);
    this.handleChangingType = this.handleChangingType.bind(this);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  handleTagging() {
    this.onTag()
  }
  handleChangingType() {
    this.onChangeType()
  }
  renderSubtitle() {
    const { post } = this.props;
    const context = post.get('context');

    if (!context) {
      return undefined;
    }

    return (
      <View style={styles.subtitle}>
        <Icon name="Goals" width="12" height="12" fill={colors.deepBlue40} />
        <Text style={styles.subtitleLabel}>{post.getIn(['context', 'title'])}</Text>
      </View>
    )
  }
  renderHeader() {

    return <HOCHeader title="Create a Post" subtitle={this.renderSubtitle()} />
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
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <TextInput
        numberOfLines={5}
        multiline
        autoFocus
        onChangeText={this.onMessageChange}
        value={post.get('message')}
        autoCapitalize="sentences"
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
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
    let preUsers = ' to ';
    if (type === 'question') {
      preUsers = ' of ';
    }

    const taggedUsers = post.get('taggedUsers');
    if (taggedUsers.size) {
      string.push(preUsers);
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
        <StyledText
          text={string}
          textStyle={styles.textStyle}
        />
      </View>
    )
  }
  renderButton(icon, label, func) {

    return (
      <RippleButton onPress={func}>
        <View style={styles.actionButton}>
          <Icon name={icon} width="24" height="24" fill={colors.blue100} />
          <Text style={styles.actionButtonLabel}>{label}</Text>
        </View>
      </RippleButton>
    )
  }
  renderActionButtons() {

    return (
      <View style={styles.actionButtons}>
        {this.renderButton('Assign', 'Tag', this.handleTagging)}
        {this.renderButton('Type', 'Type', this.handleChangingType)}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.createHeader}>
            {this.renderProfilePic()}
            {this.renderTextArea()}
          </View>
          {this.renderStyledText()}
        </ScrollView>
        {this.renderActionButtons()}
      </View>
    )
  }
}

export default PostCreate
// const { string } = PropTypes;
PostCreate.propTypes = {};
