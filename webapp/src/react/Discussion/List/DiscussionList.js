import React, { useContext, useEffect, useRef } from 'react';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import { MyIdContext } from 'src/react/contexts';

import SW from './DiscussionList.swiss';

export default function DiscussionList({ type, onSelectItemId }) {
  const myId = useContext(MyIdContext);
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

  const didSelectRef = useRef();
  useEffect(() => {
    if (req.items && req.items.length && !didSelectRef.current) {
      onSelectItemId(req.items[0].discussion_id);
      didSelectRef.current = true;
    }
  });

  useUpdate('discussion', update => {
    if (!update.last_comment) {
      return req.mergeItem(update);
    }
    if (
      (type === 'following' && update.followers[myId]) ||
      (type === 'all other' && !update.followers[myId])
    ) {
      req.fetchNew();
    }
  });

  if (req.error || req.loading) {
    return (
      <SW.Wrapper>
        <RequestLoader req={req} />
      </SW.Wrapper>
    );
  }

  return (
    <SW.Wrapper>
      <DiscussionListItems req={req} onSelectItemId={onSelectItemId} />
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
    </SW.Wrapper>
  );
}
