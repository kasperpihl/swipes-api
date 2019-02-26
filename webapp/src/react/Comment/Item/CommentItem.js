import React, { PureComponent } from 'react';
import moment from 'moment';

import UserImage from 'src/react/_components/UserImage/UserImage';
import Attachment from 'src/react/_components/attachment/Attachment';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseMentions from 'src/utils/parseMentions';

import userGetFullName from 'core/utils/user/userGetFullName';

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

  renderLeftSide() {
    const { comment, isSingleLine, ownedBy } = this.props;
    if (isSingleLine) {
      return (
        <SW.TimeStamp>{moment(comment.sent_at).format('LT')}</SW.TimeStamp>
      );
    }
    return (
      <SW.Picture>
        <UserImage
          userId={comment.sent_by}
          organizationId={ownedBy}
          size={30}
        />
      </SW.Picture>
    );
  }

  renderTopSide() {
    const { comment, isSingleLine, ownedBy } = this.props;
    const fullName = userGetFullName(comment.sent_by, ownedBy);
    if (isSingleLine) {
      return null;
    }
    return (
      <SW.TopWrapper>
        <SW.Name>{`${fullName}`}</SW.Name>
        <SW.Time>{`${moment(comment.sent_at).format('LT')}`}</SW.Time>
      </SW.TopWrapper>
    );
  }
  render() {
    const { comment, postId, discussionId, ownedBy, isSingleLine } = this.props;

    return (
      <SW.ProvideContext isSingleLine={isSingleLine}>
        <SW.Wrapper>
          <SW.LeftSide>{this.renderLeftSide()}</SW.LeftSide>
          <SW.Center>
            {this.renderTopSide()}
            <SW.Message>
              {chain(parseNewLines, parseMentions, parseLinks)(comment.message)}
            </SW.Message>
            {this.renderAttachments()}
          </SW.Center>
          <SW.RightSide>
            <SW.Button icon="ThreeDots" size={30} />
            <SW.Reaction
              ownedBy={ownedBy}
              discussionId={discussionId}
              reactions={comment.reactions}
              postId={postId}
              commentId={comment.comment_id}
              liked={Object.keys(comment.reactions).length > 0}
            />
          </SW.RightSide>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
