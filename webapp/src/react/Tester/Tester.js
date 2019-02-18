import React from 'react';
import usePaginationRequest from 'src/react/_hooks/usePaginationRequest';

export default function Tester() {
  const req = usePaginationRequest(
    'discussion.list',
    { type: 'following' },
    {
      // Which key to use as the ><
      cursorKey: 'last_comment_at',
      // Where to find the data on response (res.discussions)
      resultPath: 'discussions',
      idAttribute: 'discussion_id'
    }
  );

  // useUpdate('discussion', discussion => {
  //   if (discussion.discussion_id === discussionId) {
  //     req.fetchNew();
  //   }
  // });

  console.log(req);
  return <div>Hi</div>;
}
