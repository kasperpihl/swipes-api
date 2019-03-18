import React, { Fragment } from 'react';
import moment from 'moment';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import CommentItem from 'src/react/Comment/Item/CommentItem';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';
import useUpdate from 'core/react/_hooks/useUpdate';
import useScrollComments from 'src/react/Comment/useScrollComments';
import SW from './CommentList.swiss';

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
      if (comment.sent_at) {
        req.prependItem(comment);
      } else {
        req.mergeItem(comment);
      }
    }
  });

  useScrollComments(scrollRef, req.items);

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.items || !req.items.length) {
    return (
      <SW.EmptyState
        showIcon
        title="IT’S STILL AND QUIET"
        description={`Whenever someone comments on this discussion \n it will show up here.`}
      />
    );
  }
  let deltaDate = moment('1970-02-15');
  let deltaSentBy;

  return (
    <>
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
      {req.items
        .slice()
        .reverse()
        .map(comment => {
          const currentDate = moment(comment.sent_at);
          const showSectionHeader = currentDate.isAfter(deltaDate, 'days');
          const isSingleLine =
            !showSectionHeader && deltaSentBy === comment.sent_by;
          deltaDate = currentDate;
          deltaSentBy = comment.sent_by;

          return (
            <Fragment key={comment.comment_id}>
              {showSectionHeader && (
                <SectionHeader>{currentDate.format('MMM D')}</SectionHeader>
              )}
              <CommentItem
                comment={comment}
                discussionId={discussion.discussion_id}
                ownedBy={discussion.owned_by}
                isSingleLine={isSingleLine}
              />
            </Fragment>
          );
        })}
    </>
  );
}
