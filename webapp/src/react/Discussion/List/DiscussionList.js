import React, { useEffect, useRef } from 'react';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './DiscussionList.swiss';

export default function DiscussionList({ type, onSelectItemId, selectedId }) {
  const myId = useMyId();
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
    if (update.deleted) {
      req.removeItem(update);
      if (update.discussion_id === selectedId) {
        let nextId = req.items[0].discussion_id;
        if (nextId === update.discussion_id) {
          nextId = req.items[1].discussion_id;
        }
        onSelectItemId(nextId);
      }
      return;
    }
    if (update.created_at) {
      onSelectItemId(update.discussion_id);
    }
    if (!update.last_comment_by) {
      return req.mergeItem(update);
    }
    if (
      (type === 'following' && update.members[myId]) ||
      (type === 'all other' && !update.members[myId])
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
      <DiscussionListItems
        req={req}
        onSelectItemId={onSelectItemId}
        selectedId={selectedId}
      />
      <PaginationScrollToMore
        req={req}
        errorLabel="Couldn't get discussions."
      />
    </SW.Wrapper>
  );
}
