import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import SW from './DiscussionOverview.swiss';
import EmptyState from 'src/react/components/empty-state/EmptyState'
import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/views/Comment/Composer/CommentComposer';
import CommentItem from 'src/react/views/Comment/Item/CommentItem';
import SWView from 'SWView';
import withRequests from 'src/react/hocs/withRequests';
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
export default class DiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
  }
  renderFooter() {
    const { id } = this.props;
    return (
      <SW.FooterWrapper>
        <CommentComposer discussionId={id}/>
      </SW.FooterWrapper>
    )
  }
  renderComments = (pagination) => {
    if(pagination.results) {
      return (
        <SW.CommentWrapper>
          {(pagination.results || fromJS([])).map((comment, i) => (
            <CommentItem key={i} comment={comment} />
          )).toArray()}
        </SW.CommentWrapper>
      )
    }
    return (
      <EmptyState
      icon="ESNotifications"
      title="IT’S STILL AND QUIET"
      description={`Whenever someone comments on this discussion \n it will show up here.`}
      page='Discussions'
      />
    )
  }
  render() {
    const { discussion_id, discussion } = this.props;
    if(discussion) {
      return <div>found it</div>
    } else {
      return <div>not found yet</div>
    }
    const options = {
      body: {
        discussion_id,
      },
      url: 'comment.list',
      resPath: 'comments',
    };

    return (
      <SWView
        header={<DiscussionHeader
          topic={"Test"}
          id={id}
          followers={followers}
          privacy={privacy}
        />}
        footer={this.renderFooter()}
      >
        <PaginationProvider
          options={options}
        >
          {this.renderComments}
        </PaginationProvider>
      </SWView>
    );
  }
}
