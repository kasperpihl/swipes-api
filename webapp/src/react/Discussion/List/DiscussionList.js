import React, { PureComponent } from 'react';
import DiscussionListItems from 'src/react/Discussion/List/Items/DiscussionListItems';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

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
      {!showLoad && (
        <PaginationScrollToMore errorLabel="Couldn't get discussions." />
      )}
    </SW.Wrapper>
  );
}

class DiscussionList2 extends PureComponent {
  renderItems(pagination) {
    const { onSelectItemId, optimist } = this.props;
    let { results } = pagination;
    let newSelectedId = null;

    if (!results || results.size === 0) {
      return (
        <SW.EmptyState>
          <SW.Label>There’s nothing here, yet.</SW.Label>
        </SW.EmptyState>
      );
    }

    if (results && results.size) {
      results = results.toList();
      newSelectedId = results.first().get('discussion_id');
    }

    setTimeout(() => {
      onSelectItemId(newSelectedId, results);
    }, 0);

    return (results || fromJS([])).map(item => {
      const siblingToSelectedItem = this.selectedRow || false;
      this.selectedRow =
        optimist.get('discussSelectedId') === item.get('discussion_id');

      return (
        <DiscussionListItem
          onSelectItemId={onSelectItemId}
          selected={this.selectedRow}
          first={
            results.first().get('discussion_id') === item.get('discussion_id')
          }
          siblingToSelectedItem={siblingToSelectedItem}
          item={item}
          key={item.get('discussion_id')}
        />
      );
    });
  }
  render() {
    const { type } = this.props;

    return (
      <PaginationProvider
        request={{
          body: { type },
          url: 'discussion.list',
          resPath: 'discussions'
        }}
        cache={{
          path: 'discussion',
          idAttribute: 'discussion_id',
          filter,
          orderBy: '-last_comment_at'
        }}
      >
        {pagination => (
          <SW.Wrapper>
            {this.renderItems(pagination, type)}
            <PaginationScrollToMore errorLabel="Couldn't get discussions." />
          </SW.Wrapper>
        )}
      </PaginationProvider>
    );
  }
}
