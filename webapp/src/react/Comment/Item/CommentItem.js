import React, { PureComponent } from 'react';

import timeGetTimeString from 'core/utils/time/timeGetTimeString';
import UserImage from 'src/react/_components/UserImage/UserImage';
import Attachment from 'src/react/_components/attachment/Attachment';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseMentions from 'src/utils/parseMentions';

import userGetFullName from 'core/utils/user/userGetFullName';

import CommentReaction from '../Reaction/CommentReaction';
import SW from './CommentItem.swiss';

export default class CommentItem extends PureComponent {
  renderAttachments() {
    const { comment } = this.props;

    if (!comment.attachments) {
      return undefined;
    }
    return (
      <SW.Attachments>
        {comment.attachments.map((att, i) => (
          <Attachment attachment={att} key={i} />
        ))}
      </SW.Attachments>
    );
  }
  render() {
    const { comment, postId, discussionId, ownedBy } = this.props;
    const fullName = userGetFullName(comment.sent_by, ownedBy);

    return (
      <SW.Container>
        <SW.Picture>
          <UserImage
            userId={comment.sent_by}
            organizationId={ownedBy}
            size={36}
          />
        </SW.Picture>
        <SW.Content>
          <SW.Name>{`${fullName} - ${timeGetTimeString(
            comment.sent_at
          )}`}</SW.Name>
          <SW.Message>
            {chain(parseNewLines, parseMentions, parseLinks)(comment.message)}
          </SW.Message>
          {this.renderAttachments()}
        </SW.Content>
        <SW.Actions>
          {/* <CommentReaction
            alignRight
            ownedBy={ownedBy}
            discussionId={discussionId}
            reactions={comment.reactions}
            postId={postId}
            commentId={comment.comment_id}
          /> */}
        </SW.Actions>
      </SW.Container>
    );
  }
}
