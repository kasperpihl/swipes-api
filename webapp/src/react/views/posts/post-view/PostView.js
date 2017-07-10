import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCAssigning from 'components/assigning/HOCAssigning';
import CommentInput from 'components/comment-input/CommentInput';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/post-view.scss';

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderHeader() {
    const { me } = this.props;

    if (me.get('id')) {
      const profileImage = msgGen.users.getPhoto(me.get('id'));

      return (
        <div className="post__header">
          <div className="post-header">
            <div className="post-header__image">
              <img src={profileImage} alt="" className="post-header__img" />
            </div>
            <div className="post-header__content">
              <div className="post-header__title">Yana notified <span>Kasper</span>, <span>Stefan</span>, <span>Kristjan</span> and <span>Tihomir</span></div>
              <div className="post-header__subtitle">
                <Icon className="post-header__svg" icon="Goals" />
                Learn Swipes Feedback • 2 min
              </div>
            </div>
          </div>
        </div>
      )
    }
    return undefined;
  }
  renderFooter() {
    const { delegate, me } = this.props;

    return <CommentInput me={me} delegate={delegate} />
  }
  renderMessage() {

    return (
      <div className="post__message">
        I just finished with the research and I have made a summary of the most important findings. Let me know what you think.
      </div>
    )
  }
  renderAttachments() {

    return (
      <div className="post__attachments">
        <div className="post-attachment">
          <Icon icon="Note" className="post-attachment__svg" />
          <div className="post-attachment__label">
            Design Notes
          </div>
        </div>
        <div className="post-attachment">
          <Icon icon="Hyperlink" className="post-attachment__svg" />
          <div className="post-attachment__label">
            https://projects.invisionapp.com/d/main#/console/11492934/242808848/inspect
          </div>
        </div>
      </div>
    )
  }
  renderPostActions() {


    return (
      <div className="post__actions">
        <div className="post__action">
          <Icon icon="Folder" className="post__svg" />
          <div className="post__action-label">React</div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="post">
        <SWView
          header={this.renderHeader()}
          footer={this.renderFooter()}
        >
          {this.renderMessage()}
          {this.renderAttachments()}
          {this.renderPostActions()}
        </SWView>
      </div>
    )
  }
}

export default PostView
// const { string } = PropTypes;
PostView.propTypes = {};