import React from 'react';
import DiscussionListItem from 'src/react/Discussion/List/Item/DiscussionListItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default function DiscussionListItems({
  req,
  onSelectItemId,
  selectedId
}) {
  const { items } = req;

  if (!items || !items.length) {
    return <EmptyState title="No discussions yet" />;
  }

  return items.map(item => (
    <DiscussionListItem
      onSelectItemId={onSelectItemId}
      selected={item.discussion_id === selectedId}
      item={item}
      key={item.discussion_id}
    />
  ));
}
