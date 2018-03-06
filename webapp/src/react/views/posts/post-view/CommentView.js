import React, { PureComponent } from 'react';
import { element } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { URL_REGEX, unescaper } from 'swipes-core-js/classes/utils';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import HOCAssigning from 'components/assigning/HOCAssigning';

import PostAttachment from './PostAttachment';
import PostReactions from './PostReactions';
import sw from './CommentView.swiss';

import './styles/comment-view.scss';

const Container = element('div', sw.Container);
const Picture = element('div', sw.Picture);
const Content = element('div', sw.Content);
const Actions = element('div', sw.Actions);
const Name = element('div', sw.Name);
const Timestamp = element(TimeAgo, sw.Timestamp);
const Message = element('div', sw.Message);
const Attachments = element('div', sw.Attachments);

class CommentView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onLinkClick', 'shouldScroll');
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
      <Message>
        {message}
      </Message>
    );
  }
  renderAttachments() {
    const { comment } = this.props;
    const attachments = comment.get('attachments');
    if(!attachments || !attachments.size) {
      return undefined;
    }
    return (
      <Attachments>
        {attachments.map((att, i) => (
          <PostAttachment attachment={att} key={i} />
        ))}
      </Attachments>
    )
  }
  render() {
    const { comment, postId } = this.props;
    const attachments = comment.get('attachments');
    const name = msgGen.users.getFullName(comment.get('created_by'));

    return (
      <Container>
        <Picture>
          <HOCAssigning assignees={[comment.get('created_by')]} rounded size={36} />
        </Picture>
        <Content>
          <Name>
            {name}
            <Timestamp prefix=" — " simple date={comment.get('created_at')} />
          </Name>
          {this.renderMessage()}
          {this.renderAttachments()}
        </Content>
        <Actions>
          <PostReactions
            alignRight
            reactions={comment.get('reactions')}
            postId={postId}
            commentId={comment.get('id')}
          />
        </Actions>
      </Container>
    )
  }
}

export default CommentView;
// const { string } = PropTypes;
CommentView.propTypes = {};
