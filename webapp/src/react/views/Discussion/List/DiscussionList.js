import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import { withOptimist } from 'react-optimist';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import SW from './DiscussionList.swiss';

@withOptimist
@connect(
  state => ({
    counter: state.counter.get('discussion'),
    myId: state.me.get('id'),
  }),
  {
    apiRequest: ca.api.request,
  }
)
export default class DiscussionList extends PureComponent {
  constructor(props) {
    super(props);
    this.isPreviouslySelected = false;
  }
  onInitialLoad = () => {
    const { tabIndex, apiRequest, counter } = this.props;
    if (tabIndex === 0 && counter && counter.size) {
      apiRequest('me.clearCounter', {
        type: 'discussion',
        cleared_at: counter.first().get('ts'),
      });
    }
  };
  renderItems(pagination, type) {
    const { onSelectItemId, optimist } = this.props;
    const { results } = pagination;
    let newSelectedId = null;
    if (results && results.size) {
      newSelectedId = results.first().get('id');
    }
    setTimeout(() => {
      onSelectItemId(newSelectedId, results);
    }, 0);
    return (results || fromJS([]))
      .map((item, i) => {
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
            siblingToSelectedItem={siblingToSelectedItem}
            item={item}
            key={item.get('id')}
          />)
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
          resPath: 'discussions',
        }}
        onInitialLoad={this.onInitialLoad}
        cache={{
          path: 'discussion',
          filter,
          orderBy: '-last_comment_at',
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
