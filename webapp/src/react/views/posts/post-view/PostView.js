import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, URL_REGEX } from 'swipes-core-js/classes/utils';
import { List } from 'immutable';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
import SWView from 'SWView';
import HOCAssigning from 'components/assigning/HOCAssigning';
import CommentInput from 'components/comment-input/CommentInput';
import PostHeader from 'components/post-header/PostHeader';
import CommentView from './CommentView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/post-view.scss';

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    setupDelegate(this);
    this.callDelegate.bindAll('onLinkClick')
  }
  renderHeader() {
    const { post, delegate } = this.props;

    return (
      <div className="post__header">
        <PostHeader post={post} delegate={delegate} />
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
                onClick={this.onLinkClickCached(url)}
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
          <div className="post__action-label">Like</div>
        </div>
      </div>
    )
  }
  renderComments() {
    const { post, delegate } = this.props;
    const comments = post.get('comments');

    if (comments && comments.size) {
      const renderComments = comments.map((c, i) => {
        return <CommentView comment={c} key={c.get('id')} delegate={delegate} />
      }).toArray();

      return (
        <div className="post__comments">
          {renderComments}
        </div>
      );
    }

    return undefined;
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
        {this.renderComments()}
      </SWView>
    )
  }
}

export default PostView
// const { string } = PropTypes;
PostView.propTypes = {};
