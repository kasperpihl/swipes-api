import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, URL_REGEX } from 'swipes-core-js/classes/utils';
import TimeAgo from 'components/time-ago/TimeAgo';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import Reactions from 'components/reactions/Reactions';
import './styles/comment-view.scss';

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.openReactions = this.openReactions.bind(this);
    setupDelegate(this, 'onLinkClick', 'shouldScroll');
  }
  componentDidMount() {
    if (this.props.isLast && this.shouldScroll()) {
      this.refs.comment.scrollIntoView();
    }
  }
  openReactions() {
    console.log('hihihihih');
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
      );
    }

    return (
      <div className="comment__profile-pic">
        <img src={image} />
      </div>
    );
  }
  renderName() {
    const { comment } = this.props;
    const name = msgGen.users.getFullName(comment.get('created_by'));

    return (
      <span className="comment__name">
        {name}
      </span>
    );
  }
  renderStuff(regex, inputArray, renderMethod) {
    let resArray = [];
    if(typeof inputArray === 'string') {
      inputArray = [inputArray];
    }
    inputArray.forEach((string) => {
      if(typeof string !== 'string'){
        return resArray.push(string);
      }
      const matches = string.match(regex);
      if(matches) {
        let innerSplits = string.split(regex);
        matches.forEach((match, i) => {
          innerSplits.splice(1 + i + i, 0, renderMethod.call(null, match, i));
        });
        resArray = resArray.concat(innerSplits);
      } else {
        resArray.push(string);
      }
    });
    return resArray;
  }
  renderMessage() {
    /*
    <!USTFL9YVE|Tihomir> hi beauty

    [
      <a href>T</a>,
       hi beauty
    ]

    */
    const { comment } = this.props;

    const newLinesArray = comment.get('message').split('\n');
    const newLinesCount = newLinesArray.length - 1;
    const message = newLinesArray.map((item, key) => {
      const newLine = newLinesCount === key ? null : (<br />);
      item = this.renderStuff(/<![A-Z0-9]*\|.*?>/gi, item, (mention, i) => {
        const index = mention.indexOf('|');
        const id = mention.substring(2, index - 1);
        const name = mention.substr(index + 1, mention.length - index - 2);
        return <b key={`mention${i}`}>{name}</b>;
      });
      item = this.renderStuff(URL_REGEX, item, (url, i) => (
        <a
          onClick={this.onLinkClickCached(url)}
          className="notification__link"
          key={`link${i}`}
        >
          {url}
        </a>
      ));
      return (
        <span key={key}>{item}{newLine}</span>
      );
    });

    return (
      <span className="comment__content">
        {message}
      </span>
    );
  }
  renderAttachments() {
    const { comment } = this.props;
    const attachments = comment.get('attachments');
    if(!attachments || !attachments.size) {
      return undefined;
    }
    return (
      <div className="comment__attachments">
        {attachments.map((att, i) => (
          <HOCAttachmentItem attachment={att} key={i} />
        ))}
      </div>
    )
  }
  renderReaction() {
    const { comment, delegate, loadingReaction } = this.props;

    return (
      <Reactions
        reactions={comment.get('reactions')}
        isLoading={loadingReaction}
        delegate={delegate}
        commentId={comment.get('id')}
        fromFeed
      />
    );
  }
  render() {
    const { comment } = this.props;

    return (
      <div className="comment" ref="comment">
        {this.renderProfilePic()}
        <div className="comment__side">
          <div className="comment__section">
            {this.renderName()}
            {this.renderMessage()}
            <TimeAgo
              className="comment__timestamp"
              prefix=" — "
              simple
              date={comment.get('created_at')}
            />
          </div>
          {this.renderAttachments()}
        </div>
        <div className="comment__reactions">
          {this.renderReaction()}
        </div>
      </div>
    );
  }
}

export default CommentView;
// const { string } = PropTypes;
CommentView.propTypes = {};
