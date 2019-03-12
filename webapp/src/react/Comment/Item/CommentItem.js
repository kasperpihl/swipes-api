import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import UserImage from 'src/react/_components/UserImage/UserImage';
import Attachment from 'src/react/_components/attachment/Attachment';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseMentions from 'src/utils/parseMentions';
import request from 'core/utils/request';
import withNav from 'src/react/_hocs/Nav/withNav';
import contextMenu from 'src/utils/contextMenu';

import userGetFullName from 'core/utils/user/userGetFullName';

import SW from './CommentItem.swiss';
import FormModal from 'src/react/_components/FormModal/FormModal';

@withNav
@connect(state => ({
  me: state.me
}))
export default class CommentItem extends PureComponent {
  handleListMenuClick = (i, button) => {
    const { nav, comment } = this.props;
    if (button === 'Delete comment') {
      nav.openModal(FormModal, {
        title: 'Delete comment',
        subtitle: 'Are you sure that you want to delete this comment?',
        confirmLabel: 'Delete',
        onConfirm: this.callbackDeleteComment
      });
    } else if (button === 'Edit comment') {
      nav.openModal(EditCommentModal, {
        initialValue: comment.message,
        confirmLabel: 'Edit',
        onConfirm: this.handleEditComment
      });
    }
  };

  handleEditComment = () => {
    console.log('edited');
  };

  callbackDeleteComment = () => {
    const { comment, discussionId } = this.props;
    request('comment.delete', {
      discussion_id: discussionId,
      comment_id: comment.comment_id
    });
  };

  openContextMenu = e => {
    contextMenu(ListMenu, e, {
      onClick: this.handleListMenuClick,
      buttons: ['Delete comment', 'Edit comment']
    });
  };

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
    const {
      comment,
      postId,
      discussionId,
      ownedBy,
      isSingleLine,
      me
    } = this.props;
    const commentIsSentByMe = me.get('user_id') === comment.sent_by;
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
            {commentIsSentByMe && (
              <SW.Button
                icon="ThreeDots"
                size={30}
                onClick={this.openContextMenu}
              />
            )}
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
