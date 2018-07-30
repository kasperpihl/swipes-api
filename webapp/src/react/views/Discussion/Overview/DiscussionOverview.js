import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import * as ca from 'swipes-core-js/actions';
import { connect } from 'react-redux';
import SW from './DiscussionOverview.swiss';
import EmptyState from 'src/react/components/empty-state/EmptyState'
import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/views/Comment/Composer/CommentComposer';
import CommentItem from 'src/react/views/Comment/Item/CommentItem';
import SWView from 'SWView';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
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
  renderFooter() {
    const { discussion } = this.props;
    return (
      <SW.FooterWrapper>
        <CommentComposer discussionId={discussion.get('id')}/>
      </SW.FooterWrapper>
    )
  }
  renderComments = (pagination) => (
    <SW.CommentWrapper>
      {(pagination.results || fromJS([])).map((comment, i) => (
        <CommentItem key={i} comment={comment} />
      )).toArray()}
      <PaginationScrollToMore errorLabel="Couldn't get discussions." />
      {pagination.results && !pagination.results.size && (
        <EmptyState
          icon="ESNotifications"
          title="IT’S STILL AND QUIET"
          description={`Whenever someone comments on this discussion \n it will show up here.`}
          page='Discussions'
        />
      )}
    </SW.CommentWrapper>
  )
  render() {
    const { discussion } = this.props;
    if(!discussion) {
      return <div>not found yet</div>
    }

    return (
      <SWView
        header={<DiscussionHeader discussion={discussion} />}
        footer={this.renderFooter()}
      >
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
          {this.renderComments}
        </PaginationProvider>
      </SWView>
    );
  }
}
