import React, { PureComponent } from 'react';
import * as ca from 'swipes-core-js/actions';
import { connect } from 'react-redux';

import withRequests from 'swipes-core-js/components/withRequests';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import Loader from 'src/react/components/loaders/Loader';
import DiscussionOverview from './DiscussionOverview';

export default 
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
class HOCDiscussionOverview extends PureComponent {
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
  render() {
    const { requestReady, requestError, discussion } = this.props;
    if(!requestReady) {
      return <Loader center size={54} text="Loading" />
    }

    return (
      <PaginationProvider
        request={{
          body: {
            discussion_id: discussion.get('id'),
          },
          url: 'comment.list',
          resPath: 'comments',
        }}
        limit={40}
        onInitialLoad={this.onInitialLoad}
        cache={{
          path: ['comment', discussion.get('id')],
          orderBy: '-sent_at',
        }}
      >
        <DiscussionOverview discussion={discussion} />
      </PaginationProvider>
    );
  }
}
