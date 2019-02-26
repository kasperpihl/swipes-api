import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import CommentItem from 'src/react/Comment/Item/CommentItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';
import useUpdate from 'core/react/_hooks/useUpdate';
import SWView from 'src/react/_Layout/view-controller/SWView';

const kTimeDifference = 30;
export default connect(
  state => ({
    myId: state.me.get('user_id')
  }),
  null
)(CommentList);
function CommentList({ attachmentsOnly, discussion, scrollRef, ...props }) {
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
        req.appendItem(comment);
      } else {
        req.mergeItem(comment);
      }
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
  let deltaDate = moment('1970-02-15');
  let deltaSentBy;

  return (
    <>
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
      {req.items.map(comment => {
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
