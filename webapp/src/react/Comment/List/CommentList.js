import React, { Fragment, useMemo, useEffect, useState } from 'react';
import moment from 'moment';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import CommentItem from 'src/react/Comment/Item/CommentItem';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';
import useUpdate from 'core/react/_hooks/useUpdate';
import useScrollComments from 'src/react/Comment/useScrollComments';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './CommentList.swiss';

export default function CommentList({
  attachmentsOnly,
  discussion,
  scrollRef
}) {
  const myId = useMyId();
  const [showReactionToLastComment, changeLastReaction] = useState(false);
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

  const myLastRead = useMemo(() => discussion.members[myId], []);

  useScrollComments(scrollRef, req.items);

  useEffect(() => {
    if (!!req.items && req.items.length > 0) {
      if (!!req.items && discussion.last_comment_at !== req.items[0].sent_at) {
        changeLastReaction(true);
      }
    }
  }, [discussion.last_comment_at, req.items]);

  if (req.error || req.loading) {
    return <RequestLoader req={req} />;
  }

  if (!req.items || !req.items.length) {
    return (
      <SW.EmptyState
        showIcon
        title={attachmentsOnly ? 'No files here' : 'IT’S STILL AND QUIET'}
        description={
          attachmentsOnly
            ? 'Seems like no one has attached any files yet.'
            : `Start the conversation by writing a message,
        attaching a file or sending a gif.`
        }
      />
    );
  }
  let deltaDate = moment('1970-02-15');
  let deltaSentBy;
  let indicatorDate;

  return (
    <SW.Wrapper isSystem={discussion.is_system}>
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
      {req.items
        .slice()
        .reverse()
        .map((comment, i) => {
          const currentDate = moment(comment.sent_at);
          const showSectionHeader = currentDate.isAfter(deltaDate, 'days');
          const isSingleLine =
            discussion.is_system ||
            (!showSectionHeader && deltaSentBy === comment.sent_by);

          let showNewIndicator = false;
          if (
            !indicatorDate &&
            (myLastRead === 'n' ||
              (comment.sent_at > myLastRead && comment.sent_by !== myId))
          ) {
            indicatorDate = comment.sent_at;
            showNewIndicator = true;
          }
          deltaDate = currentDate;
          deltaSentBy = comment.sent_by;
          const lastInOrder = i === req.items.length - 1;

          return (
            <Fragment key={comment.comment_id}>
              {showSectionHeader && (
                <SectionHeader>{currentDate.format('MMM D')}</SectionHeader>
              )}
              {showNewIndicator && (
                <SW.NewMessageIndicator>
                  <SW.New>NEW</SW.New>
                  <SW.Line />
                </SW.NewMessageIndicator>
              )}
              <CommentItem
                comment={comment}
                discussionId={discussion.discussion_id}
                ownedBy={discussion.owned_by}
                isSingleLine={isSingleLine}
                isSystem={discussion.is_system}
                showReactionToLastComment={
                  showReactionToLastComment && lastInOrder
                }
              />
            </Fragment>
          );
        })}
    </SW.Wrapper>
  );
}
