import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import ReactTextarea from 'react-textarea-autosize';
// import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import './styles/post-composer.scss';

class PostComposer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    setupDelegate(this)
    this.callDelegate.bindAll('onMessageChange')
  }
  componentDidMount() {
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
    const { text } = this.state;
    const { myId } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <div className="post-composer__text-wrapper">
        {this.renderProfilePic()}
        <ReactTextarea
          className="post-composer__textarea"
          value={text}
          minRows={4}
          maxRows={9}
          ref="textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
        />
      </div>
    )
  }
  render() {
    return (
      <div className="post-composer">
        {this.renderTextarea()}
      </div>
    )
  }
}

export default PostComposer
// const { string } = PropTypes;
PostComposer.propTypes = {};