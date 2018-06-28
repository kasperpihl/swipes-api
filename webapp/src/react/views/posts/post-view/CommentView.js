import React, { PureComponent } from 'react';
import { withDelegate } from 'react-delegate';
import { URL_REGEX, attachmentIconForService } from 'swipes-core-js/classes/utils';
import unescaper from 'swipes-core-js/utils/unescaper';
import HOCAssigning from 'components/assigning/HOCAssigning';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import PostReactions from '../post-components/post-reactions/PostReactions';
import SW from './CommentView.swiss';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseMentions from 'src/utils/parseMentions';

@withDelegate(['onAttachmentClick'])
class CommentView extends PureComponent {
  renderAttachments() {
    const { comment, onAttachmentClickCached } = this.props;

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
              onClick={onAttachmentClickCached(i, att)}
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
      <SW.Container>
        <SW.Picture>
          <HOCAssigning assignees={[comment.get('created_by')]} size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.Name>
            {name}
            <SW.Timestamp prefix=" — " simple date={comment.get('created_at')} />
          </SW.Name>
          <SW.Message>
            {chain(parseNewLines, parseMentions, parseLinks)(comment.get('message'))}
          </SW.Message>
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
