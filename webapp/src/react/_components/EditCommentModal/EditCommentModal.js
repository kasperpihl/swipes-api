import React, { useState } from 'react';
import SW from './EditCommentModal.swiss';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';

export default function EditCommentModal(props) {
  const [commentVal, changeCommentVal] = useState(props.initialVal);
  return (
    <SW.Wrapper>
      <CommentComposer />
    </SW.Wrapper>
  );
}
