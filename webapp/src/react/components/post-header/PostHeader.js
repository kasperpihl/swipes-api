import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, iconForId } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';
import './styles/post-header.scss';

class PostHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onHeaderContextClick', 'onHeaderMenuClick');
  }
  renderGeneratedTitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = [
      {
        id: post.get('created_by'),
        string: msgGen.users.getFirstName(post.get('created_by')),
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
          className: 'post-header__styled-button'
        });
      });
    }
    return (
      <div className="post-header__title">
        <StyledText
          text={string}
          delegate={delegate}
          className="post-header__styled-text"
        />
      </div>
    )
  }
  renderProfilePic() {
    const { post } = this.props;
    const image = msgGen.users.getPhoto(post.get('created_by'));
    const initials = msgGen.users.getInitials(post.get('created_by'));

    if (!image) {
      return (
        <div className="post-header__profile-initials">
          {initials}
        </div>
      )
    }

    return (
      <div className="post-header__profile-pic">
        <img src={image} />
      </div>
    )
    const test = '';
  }
  renderSubtitle() {
    const { post } = this.props;
    let subtitle = timeAgo(post.get('created_at'), true);
    let icon;
    if(post.get('context')) {
      subtitle = (
        <span onClick={this.onHeaderContextClick}>
          {post.getIn(['context', 'title'])}
          {' - '}
          {subtitle}
        </span>
      )
      icon = <Icon className="post-header__svg" icon={iconForId(post.getIn(['context', 'id']))} />;
    }
    return (
      <div className="post-header__subtitle">
        {icon}
        {subtitle}
      </div>
    );
  }
  render() {

    return (
      <div className="post-header">
        {this.renderProfilePic()}
        <div className="post-header__content">
          {this.renderGeneratedTitle()}
          {this.renderSubtitle()}
        </div>
      </div>
    );
  }
}

export default PostHeader

// const { string } = PropTypes;

PostHeader.propTypes = {};
