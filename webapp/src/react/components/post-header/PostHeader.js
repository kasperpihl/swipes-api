import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, iconForId } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
// import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';
import './styles/post-header.scss';

class PostHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onHeaderContextClick', 'onHeaderMenuClick', 'onOpenPost');
  }
  getType() {
    const { post } = this.props;
    const type = post.get('type');

    switch (type) {
      case 'message':
        return { label: 'Message', color: 'green' }
        break;
      case 'message':
        return { label: 'announcement', color: 'yellow' }
        break;
      case 'message':
        return { label: 'question', color: 'purple' }
        break;
      case 'message':
        return { label: 'information', color: 'blue' }
        break;
      default:
        return { label: 'Message', color: 'green' }
        break;
    }
  }
  renderGeneratedTitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = [
      {
        id: post.get('created_by'),
        string: msgGen.users.getFirstName(post.get('created_by')),
        className: 'post-header__styled-button',
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
          className: 'post-header__styled-button',
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
  renderSubtitle() {
    const { post } = this.props;
    const seperator = post.get('context') ? <span>&nbsp;•&nbsp;</span> : undefined;
    const contextTitle = post.get('context') ? post.getIn(['context', 'title']) : null;
    let icon;

    if (post.get('context')) {
      icon = <Icon className="post-header__svg" icon={iconForId(post.getIn(['context', 'id']))} />;
    }

    return (
      <div className="post-header__subtitle">
        {icon}
        <span className="post-header__span-link" onClick={this.onHeaderContextClick}>
          {contextTitle}
        </span>
      </div>
    );
  }
  renderType() {
    const type = this.getType();
    const className = `post-header__type post-header__type--${type.color}`

    return (
      <div className={className}>
        {type.label}
      </div>
    )
  }
  renderActions() {
    const { post } = this.props;
    const timeStamp = timeAgo(post.get('created_at'), true);

    return (
      <div className="post-header__actions">
        <Button small icon="ThreeDots" frameless />
        <div className="post-header__timestamp">{timeStamp}</div>
        {this.renderType()}
      </div>
    )
  }
  render() {

    return (
      <div className="post-header">
        <div className="post-header__content">
          {this.renderGeneratedTitle()}
          {this.renderSubtitle()}
        </div>
        {this.renderActions()}
      </div>
    );
  }
}

export default PostHeader

// const { string } = PropTypes;

PostHeader.propTypes = {};
