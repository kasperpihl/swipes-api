import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';
import ReactTextarea from 'react-textarea-autosize';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';

import './styles/post-composer.scss';

class PostComposer extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onMessageChange', 'onFilterClick')
    this.acOptions = {
      types: ['users'],
      delegate: props.delegate,
      trigger: "@",
    }
  }
  renderContextIcon() {
    const { post } = this.props;
    if(!post.getIn(['context', 'id'])) {
      return undefined;
    }
    return (
      <Icon icon={miniIconForId(post.getIn(['context', 'id']))} className="post-composer__svg" />
    )

  }
  renderGeneratedSubtitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = ['', {
      id: 'type',
      string: msgGen.posts.getPostComposeTypeTitle(type),
      className: 'post-composer__styled-button post-composer__styled-button--type'
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
          className: 'post-composer__styled-button post-composer__styled-button--people'
        });
      });
    }

    return (
      <div className="post-composer__subtitle">
        <div className="post-composer__context">
          {this.renderContextIcon()}
          {post.getIn(['context', 'title'])}
        </div>
        <div className="post-composer__styled-text-wrapper">
          <StyledText
            text={string}
            delegate={delegate}
            className="post-composer__styled-text"
          />
        </div>
      </div>
    )
  }
  renderProfilePic() {
    const { myId } = this.props;
    const image = msgGen.users.getPhoto(myId);
    const initials = msgGen.users.getInitials(myId);

    if (!image) {
      return (
        <div className="post-composer__profile-initials">
          {initials}
        </div>
      )
    }

    return (
      <div className="post-composer__profile-pic">
        <img src={image} />
      </div>
    )
  }
  renderTextarea() {
    const { myId, post } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <div className="post-composer__text-wrapper">
        {this.renderProfilePic()}
        <AutoCompleteInput //ReactTextarea //
          className="post-composer__textarea"
          value={post.get('message')}
          minRows={3}
          maxRows={9}
          ref="textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
          autoFocus
          options={this.acOptions}
        />
      </div>
    )
  }
  render() {
    return (
      <div className="post-composer">
        {this.renderTextarea()}
        {this.renderGeneratedSubtitle()}
      </div>
    )
  }
}

export default PostComposer
// const { string } = PropTypes;
PostComposer.propTypes = {};
