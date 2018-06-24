import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { URL_REGEX, attachmentIconForService } from 'swipes-core-js/classes/utils';
import unescaper from 'swipes-core-js/utils/unescaper';
import HOCAssigning from 'components/assigning/HOCAssigning';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import PostReactions from '../post-components/post-reactions/PostReactions';
import SW from './CommentView.swiss';
import plainMentionToContentState from 'src/utils/draft-js/plainMentionToContentState';

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onLinkClick', 'shouldScroll', 'onAttachmentClick');
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
    const { comment } = this.props;

    const newLinesArray = unescaper(comment.get('message')).split('\n');
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
        <Link
          onClick={this.onLinkClickCached(url)}
          className="notification__link"
          key={`link${i}`}
        >
          {url}
        </Link>
      ));
      return (
        <span key={key}>{item}{newLine}</span>
      );
    });

    return (
      <SW.Message>
        {message}
      </SW.Message>
    );
  }
  renderAttachments() {
    const { comment } = this.props;

    if(!comment.get('attachments') || !comment.get('attachments').size) {
      return undefined;
    }
    return (
      <SW.Attachments>
        {comment.get('attachments').map((att, i) => {
          const icon = attachmentIconForService(att.getIn(['link', 'service']));
          return (
            <PostAttachment
              title={att.get('title')}
              key={i}
              onClick={this.onAttachmentClickCached(i, att)}
              icon={icon}
            />
          );
        })}
      </SW.Attachments>
    )
  }
  render() {
    const { comment, postId } = this.props;
    const attachments = comment.get('attachments');
    const name = msgGen.users.getFullName(comment.get('created_by'));

    return (
      <SW.Container onClick={() => {
        plainMentionToContentState(this.props.comment.get('message'));
      }}>
        <SW.Picture>
          <HOCAssigning assignees={[comment.get('created_by')]} size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.Name>
            {name}
            <SW.Timestamp prefix=" — " simple date={comment.get('created_at')} />
          </SW.Name>
          {this.renderMessage()}
          {this.renderAttachments()}
        </SW.Content>
        <SW.Actions>
          <PostReactions
            alignRight
            reactions={comment.get('reactions')}
            postId={postId}
            commentId={comment.get('id')}
          />
        </SW.Actions>
      </SW.Container>
    )
  }
}

export default CommentView;
