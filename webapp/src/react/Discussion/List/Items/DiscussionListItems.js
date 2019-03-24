import React, { useRef } from 'react';
import { connect } from 'react-redux';
import DiscussionListItem from 'src/react/Discussion/List/Item/DiscussionListItem';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';

export default connect(state => ({
  teams: state.teams
}))(DiscussionListItems);

function DiscussionListItems({
  req,
  onSelectItemId,
  selectedId,
  teams
}) {
  const { items } = req;
  const selectedRef = useRef();

  if (!items || !items.length) {
    return <EmptyState title="No discussions yet" />;
  }

  return items.map(item => (
    <DiscussionListItem
      showTeam={teams.size > 1}
      onSelectItemId={onSelectItemId}
      selected={item.discussion_id === selectedId}
      item={item}
      key={item.discussion_id}
    />
  ));
}
