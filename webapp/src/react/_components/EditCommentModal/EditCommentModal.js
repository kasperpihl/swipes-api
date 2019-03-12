import React, { PureComponent } from 'react';
import SW from './EditCommentModal.swiss';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';

export default function EditCommentModal() {
  return (
    <SW.Wrapper>
      <CommentComposer />
    </SW.Wrapper>
  );
}
