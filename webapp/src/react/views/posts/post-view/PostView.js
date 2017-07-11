import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, URL_REGEX } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
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
  }
  renderHeader() {
    const { post } = this.props;
    const subtitle = timeAgo(post.get('created_at'), true);

    return (
      <div className="post__header">
        <div className="post-header">
          {this.renderProfilePic()}
          <div className="post-header__content">
            <div className="post-header__title">Yana notified <span>Kasper</span>, <span>Stefan</span>, <span>Kristjan</span> and <span>Tihomir</span></div>
            <div className="post-header__subtitle">
              {/*<Icon className="post-header__svg" icon="Goals" />*/}
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    )
  }
  renderFooter() {
    const { delegate, myId } = this.props;

    return <CommentInput myId={myId} delegate={delegate} />
  }
  renderMessage() {
    const { post } = this.props;

    if (post && post.get('message')) {

      let message = post.get('message');

      message = message.split('\n').map((item, key) => {
        const urls = item.match(URL_REGEX);
        if (urls) {
          item = item.split(URL_REGEX);
          urls.forEach((url, i) => {
            item.splice(1 + i + i, 0, (
              <a
                onClick={this.onClickURLCached(url)}
                className="notification__link"
                key={'link' + i}
              >
                {url}
              </a>
            ));
          })
        }

        return <span key={key}>{item}<br /></span>;
      });


      return (
        <div className="post__message">
          {message}
        </div>
      )
    }

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
          <Icon icon="Reaction" className="post__svg" />
          <div className="post__action-label">React</div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
      >
        {this.renderMessage()}
        {/*{this.renderAttachments()}*/}
        {this.renderPostActions()}
      </SWView>
    )
  }
}

export default PostView
// const { string } = PropTypes;
PostView.propTypes = {};