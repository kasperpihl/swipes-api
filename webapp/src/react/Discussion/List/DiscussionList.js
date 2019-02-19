import React from 'react';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
// import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import usePaginationRequest from 'src/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import SW from './DiscussionList.swiss';

export default function DiscussionList({ type, onSelectItemId }) {
  const req = usePaginationRequest(
    'discussion.list',
    {
      type
    },
    {
      idAttribute: 'discussion_id',
      cursorKey: 'last_comment_at',
      resultPath: 'discussions'
    }
  );

  const showLoad = req.error || req.loading;

  return (
    <SW.Wrapper>
      {showLoad && <RequestLoader req={req} />}
      {!showLoad && (
        <DiscussionListItems req={req} onSelectItemId={onSelectItemId} />
      )}
      {/* {!showLoad && (
        <PaginationScrollToMore errorLabel="Couldn't get discussions." />
      )} */}
    </SW.Wrapper>
  );
}
