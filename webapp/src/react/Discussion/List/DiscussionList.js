import React from 'react';
import { connect } from 'react-redux';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import useUpdate from 'core/react/_hooks/useUpdate';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import SW from './DiscussionList.swiss';

export default connect(state => ({
  myId: state.me.get('user_id')
}))(DiscussionList);

function DiscussionList({ myId, type, onSelectItemId }) {
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

  useUpdate('discussion', update => {
    if (!update.last_comment) {
      return req.mergeItems(items =>
        items.map(item => {
          if (update.discussion_id !== item.discussion_id) return item;
          return { ...item, ...update };
        })
      );
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
