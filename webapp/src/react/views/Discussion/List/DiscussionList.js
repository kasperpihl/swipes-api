import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import { withOptimist } from 'react-optimist';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import Button from 'src/react/components/Button/Button';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import DiscussionComposer from 'src/react/views/Discussion/Composer/DiscussionComposer';
import SW from './DiscussionList.swiss';
import request from 'swipes-core-js/utils/request';

@navWrapper
@withOptimist
@connect(state => ({
  counter: state.counter.get('discussion'),
  myId: state.me.get('id')
}))
export default class DiscussionList extends PureComponent {
  constructor(props) {
    super(props);
    this.isPreviouslySelected = false;
  }
  onDiscuss = () => {
    const { context, taggedUsers, openModal } = this.props;
    openModal({
      component: DiscussionComposer,
      title: 'Create Post',
      position: 'center',
      props: {
        context,
        taggedUsers
      }
    });
  };
  onInitialLoad = () => {
    const { tabIndex, counter } = this.props;
    if (tabIndex === 0 && counter && counter.size) {
      request('me.clearCounter', {
        type: 'discussion',
        cleared_at: counter.first().get('ts')
      });
    }
  };
  renderItems(pagination, type) {
    const { onSelectItemId, optimist, compact, viewWidth } = this.props;
    const { results } = pagination;
    let newSelectedId = null;

    if (!results || results.size === 0) {
      return (
        <SW.EmptyState>
          <SW.Label>There’s nothing here, yet.</SW.Label>
          <Button title="Start a new discussion" onClick={this.onDiscuss} />
        </SW.EmptyState>
      );
    }

    if (results && results.size) {
      newSelectedId = results.first().get('id');
    }

    setTimeout(() => {
      onSelectItemId(newSelectedId, results);
    }, 0);

    return (results || fromJS([]))
      .map(item => {
        const selected = optimist.get('discussSelectedId') === item.get('id');
        let siblingToSelectedItem = false;

        if (this.isPreviouslySelected) {
          siblingToSelectedItem = true;
        }

        this.isPreviouslySelected = selected;

        return (
          <DiscussionListItem
            onSelectItemId={onSelectItemId}
            selected={selected}
            compact={compact}
            first={results.first().get('id') === item.get('id')}
            siblingToSelectedItem={siblingToSelectedItem}
            item={item}
            key={item.get('id')}
            viewWidth={viewWidth}
          />
        );
      })
      .toArray();
  }
  render() {
    const { tabIndex, myId } = this.props;
    let type = 'following';
    let filter = d => d.get('followers').find(o => o.get('user_id') === myId);
    if (tabIndex === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find(o => o.get('user_id') === myId);
    } else if (tabIndex === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId;
    }

    return (
      <PaginationProvider
        request={{
          body: { type },
          url: 'discussion.list',
          resPath: 'discussions'
        }}
        onInitialLoad={this.onInitialLoad}
        cache={{
          path: 'discussion',
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
