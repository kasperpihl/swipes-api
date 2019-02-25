import React, { useRef } from 'react';
import { withOptimist } from 'react-optimist';
import DiscussionListItem from 'src/react/Discussion/List/Item/DiscussionListItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default withOptimist(DiscussionListItems);

function DiscussionListItems({ req, optimist, onSelectItemId }) {
  const { items } = req;
  const selectedRef = useRef();

  if (!items || !items.length) {
    return <EmptyState title="No discussions yet" />;
  }

  // onSelectItemId(newSelectedId, results);

  return items.map(item => {
    const siblingToSelectedItem = selectedRef.current || false;
    selectedRef.current =
      optimist.get('discussSelectedId') === item.discussion_id;

    return (
      <DiscussionListItem
        onSelectItemId={onSelectItemId}
        selected={selectedRef.current}
        first={items[0].discussion_id === item.discussion_id}
        siblingToSelectedItem={siblingToSelectedItem}
        item={item}
        key={item.discussion_id}
      />
    );
  });
}
