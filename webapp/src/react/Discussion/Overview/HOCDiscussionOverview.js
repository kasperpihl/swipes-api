import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import propsOrPop from 'src/react/_hocs/propsOrPop';
import withRequests from 'swipes-core-js/components/withRequests';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import Loader from 'src/react/_components/loaders/Loader';
import DiscussionOverview from './DiscussionOverview';
import request from 'swipes-core-js/utils/request';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';

@navWrapper
@withRequests({
  discussion: {
    request: {
      url: 'discussion.get',
      body: props => ({
        discussion_id: props.discussionId
      }),
      resPath: 'discussion'
    },
    cache: {
      path: props => ['discussion', props.discussionId]
    }
  }
})
@connect(state => ({
  myId: state.me.get('user_id')
}))
@propsOrPop('discussion')
export default class HOCDiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  onInitialLoad = () => {
    const { discussion, myId } = this.props;
    const ts = discussion.getIn(['followers', myId]);
    if (ts === 'n' || ts < discussion.get('last_comment_at')) {
      request('discussion.markAsRead', {
        read_at: discussion.get('last_comment_at'),
        discussion_id: discussion.get('discussion_id')
      });
    }
  };
  render() {
    const { requestReady, requestError, discussion } = this.props;
    if (!requestReady) {
      return <Loader center size={54} text="Loading" />;
    }

    // @kasper how I should fix this
    if (!discussion) {
      return null;
    }

    return (
      <PaginationProvider
        request={{
          body: {
            discussion_id: discussion.get('discussion_id')
          },
          url: 'comment.list',
          resPath: 'comments'
        }}
        limit={40}
        onInitialLoad={this.onInitialLoad}
        cache={{
          path: ['comment', discussion.get('discussion_id')],
          orderBy: '-sent_at',
          idAttribute: 'comment_id'
        }}
      >
        <DiscussionOverview discussion={discussion} />
      </PaginationProvider>
    );
  }
}
