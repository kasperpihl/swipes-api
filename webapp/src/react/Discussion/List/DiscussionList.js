import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';
import { withOptimist } from 'react-optimist';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';

import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';

import SW from './DiscussionList.swiss';

@navWrapper
@withOptimist
@connect(state => ({
  myId: state.me.get('user_id')
}))
export default class DiscussionList extends PureComponent {
  renderItems(pagination, type) {
    const { onSelectItemId, optimist, viewWidth } = this.props;
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
          viewWidth={viewWidth}
        />
      );
    });
  }
  render() {
    const { tabIndex, myId } = this.props;
    let type = 'following';
    let filter = d => d.get('followers').find((ts, uId) => uId === myId);

    if (tabIndex === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find((ts, uId) => uId === myId);
    }

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
