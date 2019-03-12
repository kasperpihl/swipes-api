import React, { useState } from 'react';

import CommentComposer from 'src/react/Comment/Composer/CommentComposer';

import request from 'core/utils/request';
import Spacing from '_shared/Spacing/Spacing';

import SW from './EditCommentModal.swiss';

export default function EditCommentModal({
  initialMessage,
  initialAttachments,
  commentId,
  discussionId,
  ownedBy,
  hideModal
}) {
  return (
    <SW.Wrapper>
      <SW.Title>Edit Comment</SW.Title>
      <Spacing height={12} />
      <CommentComposer
        initialMessage={initialMessage}
        initialAttachments={initialAttachments}
        editCommentId={commentId}
        discussionId={discussionId}
        ownedBy={ownedBy}
        onSuccess={hideModal}
      />
    </SW.Wrapper>
  );
}
