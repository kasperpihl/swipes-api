import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';

import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import SW from './DiscussionList.swiss';
import ActionBar from './ActionBar';

@connect(state => ({
  counter: state.counter.get('discussion'),
  myId: state.me.get('id'),
}), {
  apiRequest: ca.api.request,
})
export default class DiscussionList extends PureComponent {
  onInitialLoad = () => {
    const { activeItem, apiRequest, counter } = this.props;
    if(activeItem === 0 && counter && counter.size) {
      apiRequest('me.clearCounter', {
        type: 'discussion',
        cleared_at: counter.first().get('ts'),
      });
    }
  }
  renderItems(pagination) {
    const { results } = pagination;
    return (results || fromJS([])).map((item, i) => (
      <DiscussionListItem item={item} key={i}/>
    )).toArray();
  }
  render() {
    const { activeItem, myId } = this.props;
    let type = 'following';
    let filter = (d) => d.get('followers').find(o => o.get('user_id') === myId);
    if(activeItem === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find(o => o.get('user_id') === myId);
    }
    else if(activeItem === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId
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
        }}>
        {pagination => (
          <SW.Wrapper>
            {this.renderItems(pagination)}
            <PaginationScrollToMore errorLabel="Couldn't get discussions." />
            <ActionBar />
          </SW.Wrapper>
        )}
      </PaginationProvider>
    );
  }
}
