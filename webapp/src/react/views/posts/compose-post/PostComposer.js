import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import ReactTextarea from 'react-textarea-autosize';
// import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';

import './styles/post-composer.scss';

class PostComposer extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this)
    this.callDelegate.bindAll('onMessageChange', 'onFilterClick');
  }
  componentDidMount() {
  }
  renderGeneratedSubtitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = ['— ', {
      id: 'type',
      string: msgGen.posts.getPostComposeTypeTitle(type),
    }];

    const taggedUsers = post.get('taggedUsers');
    if (taggedUsers.size) {
      string.push(' to ');
      taggedUsers.forEach((id, i) => {
        if (i > 0) {
          string.push(i === taggedUsers.size - 1 ? ' and ' : ', ');
        }
        string.push({
          id,
          string: msgGen.users.getFirstName(id),
        });
      });
    }

    return (
      <div className="post-composer__subtitle">
        <StyledText
          text={string}
          delegate={delegate}
        />
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
        <ReactTextarea
          className="post-composer__textarea"
          value={post.get('message')}
          minRows={3}
          maxRows={9}
          ref="textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
          autoFocus
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
