import React from 'react';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import CommentItem from 'src/react/Comment/Item/CommentItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';
import useUpdate from 'core/react/_hooks/useUpdate';

export default function CommentList({
  attachmentsOnly,
  discussion,
  scrollRef
}) {
  const req = usePaginationRequest(
    'comment.list',
    {
      discussion_id: discussion.discussion_id,
      attachments_only: attachmentsOnly
    },
    {
      cursorKey: 'sent_at',
      idAttribute: 'comment_id',
      resultPath: 'comments'
    }
  );

  useUpdate('comment', comment => {
    if (comment.discussion_id === discussion.discussion_id) {
      req.fetchNew();
    }
  });

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.items || !req.items.length) {
    return (
      <EmptyState
        showIcon
        title="IT’S STILL AND QUIET"
        description={`Whenever someone comments on this discussion \n it will show up here.`}
      />
    );
  }

  return (
    <>
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
      {req.items.map(comment => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          discussionId={discussion.discussion_id}
          ownedBy={discussion.owned_by}
        />
      ))}
    </>
  );
}
