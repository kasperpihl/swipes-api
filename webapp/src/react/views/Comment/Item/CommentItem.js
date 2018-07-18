import React, { PureComponent } from 'react';
import { withDelegate } from 'react-delegate';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import HOCAssigning from 'components/assigning/HOCAssigning';
import PostAttachment from 'src/react/views/posts/post-components/post-attachment/PostAttachment';
import CommentReaction from '../Reaction/CommentReaction';
import SW from './CommentItem.swiss';

@withDelegate(['onAttachmentClick'])
export default class CommentItem extends PureComponent {
  renderAttachments() {
    const { comment, onAttachmentClickCached } = this.props;

    if(!comment.attachments || !comment.attachments.length) {
      return undefined;
    }
    return (
      <SW.Attachments>
        {comment.attachments.map((att, i) => (
          <PostAttachment
            title={att.title}
            key={i}
            onClick={onAttachmentClickCached(i, att)}
            icon={attachmentIconForService(att.link.service)}
          />
        ))}
      </SW.Attachments>
    )
  }
  render() {
    const { comment, postId } = this.props;
    const attachments = comment.attachments;
    const name = msgGen.users.getFullName(comment.sent_by);

    return (
      <SW.Container>
        <SW.Picture>
          <HOCAssigning assignees={[comment.sent_by]} size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.Name>
            {name}
            <SW.Timestamp prefix=" — " simple date={comment.sent_at} />
          </SW.Name>
          <SW.Message>
            {comment.message}
          </SW.Message>
          {this.renderAttachments()}
        </SW.Content>
        <SW.Actions>
          <CommentReaction
            alignRight
            reactions={comment.reactions || []}
            postId={postId}
            commentId={comment.id}
          />
        </SW.Actions>
      </SW.Container>
    )
  }
}
