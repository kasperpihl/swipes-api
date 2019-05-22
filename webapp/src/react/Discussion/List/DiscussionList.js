import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './DiscussionList.swiss';

export default connect(state => ({
  selectedTeamId: state.main.get('selectedTeamId')
}))(DiscussionList);

function DiscussionList({ type, onSelectItemId, selectedId, selectedTeamId }) {
  const myId = useMyId();
  const req = usePaginationRequest(
    'discussion.list',
    {
      type,
      owned_by: selectedTeamId
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

  const selectedRef = useRef(selectedTeamId);
  useEffect(() => {
    if (selectedTeamId !== selectedRef.current) {
      req.retry(true);
      onSelectItemId(null);
      didSelectRef.current = false;
    }
    selectedRef.current = selectedTeamId;
  }, [selectedTeamId]);

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

  if (selectedTeamId === myId) {
    return null;
  }

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
