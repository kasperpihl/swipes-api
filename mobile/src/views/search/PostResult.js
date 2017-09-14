import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/PostResult.scss';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue50,
    paddingHorizontal: 6,
  },
})

class PostResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  getType() {
    const { result } = this.props;
    const type = result.item.type;

    switch (type) {
      case 'announcement':
        return { label: 'Announcement', color: 'Yellow' }
      case 'question':
        return { label: 'Question', color: 'Purple' }
      case 'information':
        return { label: 'Information', color: 'Blue' }
      case 'post':
      default:
        return { label: 'Post', color: 'Green' }
    }
  }
  renderProfileImage() {
    const { result } = this.props;
    const userId = result.item.created_by;
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (image) {
      return <Image source={{ uri: image }}  />
    }

    return (
      <View>
        <Text>
          {initials}
        </Text>
      </View>
    )
  }
  renderGeneratedTitle() {
    const { result } = this.props;
    const { item } = result;
    const type = item.type;

    let string = [
      {
        id: item.created_by,
        string: msgGen.users.getFirstName(item.created_by, ),
        boldStyle: styles.boldStyle
      },
      ' ',
      msgGen.posts.getPostTypeTitle(type)
    ];

    const taggedUsers = item.tagged_users;

    if (taggedUsers.size) {
      string.push(' and tagged ');

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
    )
  }
  renderSubtitle() {
    const { result } = this.props;
    const { item: post } = result;
    const seperator = post.context ? <Text style={styles.subtitleLabel}>&nbsp;•&nbsp;</Text> : undefined;
    const contextTitle = post.context ? <Text style={styles.subtitleLabel}>{post.context.title}</Text> : undefined;
    const icon = post.context ? <Icon name={miniIconForId(post.getIn(['context', 'id']))} width="12" height="12" fill={colors.deepBlue40} /> : undefined;
    const padding = post.context ? 5 : 0;

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
  renderType() {
    const type = this.getType();
    const typeStyleColor = styles.typeWrapperColor + type.color

    return (
      <View styles={[styles.typeWrapper, typeStyleColor]}>
        <Text>{type.label}</Text>
      </View>
    )
  }
  renderHeader() {

    return (
      <div className="post-result__header">
        <div className="post-result__titles">
          {this.renderGeneratedTitle()}
          {this.renderSubtitle()}
        </div>
        {this.renderType()}
      </div>
    )
  }
  renderMessage() {
    const { result } = this.props;
    const { item } = result;

    return (
      <div className="post-result__message">
        <TextParser>
          {item.message}
        </TextParser>
      </div>
    )
  }
  render() {
    return (
      <View style={styles.container} >
        <Text>Hi, this is a post</Text>
      </View>
    );
  }
}

export default PostResult

// const { string } = PropTypes;

PostResult.propTypes = {};
