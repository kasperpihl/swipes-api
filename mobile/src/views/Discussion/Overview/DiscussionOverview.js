import React, { PureComponent, Fragment } from 'react';
import { fromJS } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import { connect } from 'react-redux';
import DiscussionHeader from 'src/views/Discussion/Header/DiscussionHeader';

import withRequests from 'swipes-core-js/components/withRequests';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';

@withRequests({
  discussion: {
    request: {
      url: 'discussion.get',
      body: props => ({
        discussion_id: props.discussionId,
      }),
      resPath: 'discussion',
    },
    cache: {
      path: props => ['discussion', props.discussionId],
    },
  },
})
@connect(state => ({
  myId: state.me.get('id'),
}), {
  apiRequest: ca.api.request,
})
export default class DiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  onInitialLoad = () => {
    const { discussion, myId, apiRequest } = this.props;
    const sub = discussion.get('followers').find(f => f.get('user_id') === myId);
    if(sub &&
      (!sub.get('read_at') || 
        sub.get('read_at') < discussion.get('last_comment_at'))
    ) {
      apiRequest('discussion.markAsRead', {
        read_at: discussion.get('last_comment_at'),
        discussion_id: discussion.get('id'),
      });
    }
  }
  renderComments(pagination) {
    // T_TODO: Check for pagination.results and your comments should be there.
    return null;
  }
  render() {
    const { discussion } = this.props;
    if(!discussion) {
      return null;
    }

    return (
      <Fragment>
        <DiscussionHeader {...discussion.toJS()} />
        <PaginationProvider
          request={{
            body: {
              discussion_id: discussion.get('id'),
            },
            url: 'comment.list',
            resPath: 'comments',
          }}
          limit={10}
          onInitialLoad={this.onInitialLoad}
          cache={{
            path: ['comment', discussion.get('id')],
            orderBy: '-sent_at',
          }}
        >
          {pagination => this.renderComments(pagination)}
        </PaginationProvider>
      </Fragment>
    );
  }
}
