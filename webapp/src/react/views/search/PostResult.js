import React, { PureComponent } from 'react'

// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';

import { miniIconForId } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import StyledText from 'components/styled-text/StyledText';
import TextParser from 'components/text-parser/TextParser';
import './styles/post-result.scss';

class PostResult extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLinkClick')
  }
  getType() {
    const { result } = this.props;
    const type = result.item.type;

    switch (type) {
      case 'announcement':
        return { label: 'Announcement', color: 'yellow' }
      case 'question':
        return { label: 'Question', color: 'purple' }
      case 'information':
        return { label: 'Information', color: 'blue' }
      case 'post':
      default:
        return { label: 'Post', color: 'green' }
    }
  }
  renderProfileImage() {
    const { result } = this.props;
    const userId = result.item.created_by;
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (image) {
      return <img src={image} className="post-result__image" />
    }

    return <div className="post-result__initials">{initials}</div>
  }
  renderGeneratedTitle() {
    const { result } = this.props;
    const { item } = result;
    const type = item.type;

    let string = [
      {
        id: item.created_by,
        string: msgGen.users.getFirstName(item.created_by, ),
        className: 'post-result__styled-button',
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
          className: 'post-result__styled-button',
        });
      });
    }

    return (
      <div className="post-result__title">
        <StyledText
          text={string}
          delegate={delegate}
          className="post-result__styled-text"
        />
      </div>
    )
  }
  renderSubtitle() {
    const { result } = this.props;
    const { item: post } = result;
    const seperator = post.context ? <span>&nbsp;•&nbsp;</span> : undefined;
    const contextTitle = post.context ? post.context.title : null;
    let icon;

    if (post.context) {
      icon = <Icon className="post-result__svg" icon={miniIconForId(post.context.id)} />;
    }

    return (
      <div className="post-result__subtitle">
        {icon}
        <span className="post-result__span-link">
          {contextTitle}
        </span>
        {seperator}
        <TimeAgo
          className="post-result__timestamp"
          simple
          date={post.created_at}
        />
      </div>
    );
  }
  renderType() {
    const type = this.getType();
    const className = `post-result__type post-result__type--${type.color}`

    return (
      <div className={className}>
        {type.label}
      </div>
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
      <div className="post-result">
        <div className="post-result__profile-image">
          {this.renderProfileImage()}
        </div>
        <div className="post-result__right">
          {this.renderHeader()}
          {this.renderMessage()}
        </div>
      </div>
    )
  }
}

export default PostResult
// const { string } = PropTypes;
PostResult.propTypes = {};
