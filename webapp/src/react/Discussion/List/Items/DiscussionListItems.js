import React, { useRef } from 'react';
import { connect } from 'react-redux';
import DiscussionListItem from 'src/react/Discussion/List/Item/DiscussionListItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default connect(state => ({
  organizations: state.organizations
}))(DiscussionListItems);

function DiscussionListItems({
  req,
  onSelectItemId,
  selectedId,
  organizations
}) {
  const { items } = req;
  const selectedRef = useRef();

  if (!items || !items.length) {
    return <EmptyState title="No discussions yet" />;
  }

  return items.map(item => (
    <DiscussionListItem
      showTeam={organizations.size > 1}
      onSelectItemId={onSelectItemId}
      selected={item.discussion_id === selectedId}
      item={item}
      key={item.discussion_id}
    />
  ));
}
