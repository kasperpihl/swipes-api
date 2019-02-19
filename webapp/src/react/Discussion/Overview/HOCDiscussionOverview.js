import React, { useState } from 'react';
import { connect } from 'react-redux';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import DiscussionOverview from './DiscussionOverview';
import request from 'swipes-core-js/utils/request';
import useRequest from 'src/react/_hooks/useRequest';

import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

export default connect(state => ({
  myId: state.me.get('user_id')
}))(HOCDiscussionOverview);

function HOCDiscussionOverview({ discussionId, myId }) {
  const [viewAttachments, setViewAttachments] = useState(false);

  const req = useRequest(
    'discussion.get',
    {
      discussion_id: discussionId
    },
    result => {
      const { discussion } = result;
      const ts = discussion.followers[myId];
      if (ts === 'n' || ts < discussion.last_comment_at) {
        request('discussion.markAsRead', {
          read_at: discussion.last_comment_at,
          discussion_id: discussion.discussion_id
        });
      }
    }
  );

  if (req.loading || req.error) {
    return <RequestLoader req={req} />;
  }

  const handleClick = () => {
    setViewAttachments(c => !c);
  };
  const { discussion } = req.result;
  return (
    <PaginationProvider
      key={`${viewAttachments}`}
      request={{
        body: {
          discussion_id: discussion.discussion_id,
          attachments_only: viewAttachments
        },
        url: 'comment.list',
        resPath: 'comments'
      }}
      limit={40}
      cache={{
        path: [`comment-${viewAttachments}`, discussion.discussion_id],
        orderBy: '-sent_at',
        idAttribute: 'comment_id'
      }}
    >
      <DiscussionOverview
        discussion={discussion}
        onClickAttachments={handleClick}
        viewAttachments={viewAttachments}
      />
    </PaginationProvider>
  );
}
