import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, URL_REGEX } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import Reactions from 'components/reactions/Reactions';
import './styles/comment-view.scss';

class CommentView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.openReactions = this.openReactions.bind(this);
    setupDelegate(this);
    this.callDelegate.bindAll('onLinkClick', 'shouldScroll')
  }
  componentDidMount() {
    if (this.props.isLast && this.shouldScroll()) {
      this.refs.comment.scrollIntoView();
    }
  }
  openReactions() {
    console.log('hihihihih')
  }
  renderProfilePic() {
    const { comment } = this.props;
    const image = msgGen.users.getPhoto(comment.get('created_by'));
    const initials = msgGen.users.getInitials(comment.get('created_by'));

    if (!image) {
      return (
        <div className="comment__profile-initials">
          {initials}
        </div>
      )
    }

    return (
      <div className="comment__profile-pic">
        <img src={image} />
      </div>
    )
  }
  renderName() {
    const { comment } = this.props;
    const name = msgGen.users.getFullName(comment.get('created_by'));

    return (
      <div className="comment__name">
        {name}
      </div>
    )
  }
  renderMessage() {
    const { comment } = this.props;
    let message = comment.get('message');

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
      <div className="comment__content">
        {message}
      </div>
    )
  }
  renderSubLine() {
    const { comment, delegate, loadingReaction } = this.props;
    const timestamp = timeAgo(comment.get('created_at'), true);

    return (
      <div className="comment__subline">
        <Reactions
          reactions={comment.get('reactions')}
          isLoading={loadingReaction}
          delegate={delegate}
          commentId={comment.get('id')}
        /> • {timestamp}
      </div>
    )
  }
  render() {
    const { comment } = this.props;

    return (
      <div className="comment" ref="comment">
        {this.renderProfilePic()}
        <div className="comment__side">
          {this.renderName()}
          {this.renderMessage()}
          {this.renderSubLine()}
        </div>
      </div>
    )
  }
}

export default CommentView
// const { string } = PropTypes;
CommentView.propTypes = {};
