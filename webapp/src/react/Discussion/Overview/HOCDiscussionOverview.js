import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import withRequests from 'swipes-core-js/components/withRequests';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import Loader from 'src/react/_components/loaders/Loader';
import DiscussionOverview from './DiscussionOverview';
import request from 'swipes-core-js/utils/request';

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
export default class HOCDiscussionOverview extends PureComponent {
  static sizes = [654];
  state = {
    viewAttachments: false
  };
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
  onClickAttachments = () => {
    this.setState({ viewAttachments: !this.state.viewAttachments });
  };
  render() {
    const { requestReady, requestError, discussion } = this.props;
    const { viewAttachments } = this.state;
    if (!requestReady) {
      return <Loader center size={54} text="Loading" />;
    }

    // @kasper how I should fix this
    if (!discussion) {
      return null;
    }
    return (
      <PaginationProvider
        key={`${viewAttachments}`}
        request={{
          body: {
            discussion_id: discussion.get('discussion_id'),
            attachments_only: viewAttachments
          },
          url: 'comment.list',
          resPath: 'comments'
        }}
        limit={40}
        onInitialLoad={this.onInitialLoad}
        cache={{
          path: [`comment-${viewAttachments}`, discussion.get('discussion_id')],
          orderBy: '-sent_at',
          idAttribute: 'comment_id'
        }}
      >
        <DiscussionOverview
          discussion={discussion}
          onClickAttachments={this.onClickAttachments}
          viewAttachments={this.state.viewAttachments}
        />
      </PaginationProvider>
    );
  }
}
