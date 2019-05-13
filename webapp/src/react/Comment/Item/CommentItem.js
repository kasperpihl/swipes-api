import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import UserImage from '_shared/UserImage/UserImage';
import Attachment from '_shared/attachment/Attachment';
import ListMenu from '_shared/ListMenu/ListMenu';
import EditCommentModal from '_shared/EditCommentModal/EditCommentModal';
import FormModal from '_shared/FormModal/FormModal';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseGiphys from 'src/utils/parseGiphys';
import request from 'core/utils/request';
import withNav from 'src/react/_hocs/Nav/withNav';
import contextMenu from 'src/utils/contextMenu';

import userGetFullName from 'core/utils/user/userGetFullName';
import userGetFirstName from 'core/utils/user/userGetFirstName';

import SW from './CommentItem.swiss';

@withNav
@connect(state => ({
  me: state.me
}))
export default class CommentItem extends PureComponent {
  handleListMenuClick = (i, button) => {
    const { nav, comment, discussionId, ownedBy } = this.props;
    if (button === 'Delete comment') {
      nav.openModal(FormModal, {
        title: 'Delete comment',
        subtitle: 'Are you sure that you want to delete this comment?',
        confirmLabel: 'Delete',
        onConfirm: this.callbackDeleteComment
      });
    } else if (button === 'Edit comment') {
      nav.openModal(EditCommentModal, {
        initialMessage: comment.message,
        initialAttachments: comment.attachments,
        discussionId,
        ownedBy,
        commentId: comment.comment_id
      });
    }
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

    if (!comment.attachments || comment.deleted) {
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
        <UserImage userId={comment.sent_by} teamId={ownedBy} size={30} />
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
  renderRightSide() {
    const { comment, postId, discussionId, ownedBy, me } = this.props;
    if (comment.deleted) return null;

    const commentIsSentByMe = me.get('user_id') === comment.sent_by;

    return (
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
    );
  }
  render() {
    const {
      comment,
      isSingleLine,
      isSystem,
      ownedBy,
      me,
      showReactionToLastComment
    } = this.props;
    const lastPersonToReact = Object.keys(comment.reactions)[
      Object.keys(comment.reactions).length - 1
    ];
    const firstName = userGetFirstName(lastPersonToReact, ownedBy);

    return (
      <SW.ProvideContext isSingleLine={isSingleLine} isSystem={isSystem}>
        <SW.Wrapper>
          <SW.CommentWrapper>
            <SW.LeftSide>{this.renderLeftSide()}</SW.LeftSide>
            <SW.Center>
              {this.renderTopSide()}
              <SW.Message>
                {comment.deleted
                  ? 'This message has been deleted'
                  : chain(parseGiphys, parseNewLines, parseLinks)(
                      comment.message
                    )}
              </SW.Message>
              {this.renderAttachments()}
            </SW.Center>
            {this.renderRightSide()}
          </SW.CommentWrapper>
          {showReactionToLastComment && typeof lastPersonToReact === 'string' && (
            <SW.LastReaction>
              <SW.LeftSide>
                <UserImage
                  userId={lastPersonToReact}
                  teamId={ownedBy}
                  size={18}
                />
              </SW.LeftSide>
              <SW.LastReactionMessage>
                <SW.TimeStamp lastReaction>
                  {moment(comment.sent_at).format('LT')}
                </SW.TimeStamp>
                {`${firstName} liked ${
                  comment.sent_by === me.get('user_id') ? 'your' : 'this'
                } message.`}
              </SW.LastReactionMessage>
            </SW.LastReaction>
          )}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
