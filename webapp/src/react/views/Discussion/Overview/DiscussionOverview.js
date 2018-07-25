import React, { PureComponent } from 'react';
import SW from './DiscussionOverview.swiss';
import EmptyState from 'src/react/components/empty-state/EmptyState'
import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/views/Comment/Composer/CommentComposer';
import CommentItem from 'src/react/views/Comment/Item/CommentItem';
import SWView from 'SWView';
import PaginationProvider from 'src/react/components/pagination/PaginationProvider';

export default class DiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
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
          {(pagination.results || []).map((comment, i) => (
            <CommentItem key={i} comment={comment} />
          ))}
        </SW.CommentWrapper>
      )
    } else {
    return (
        <EmptyState
        icon="ESNotifications"
        title="IT’S STILL AND QUIET"
        description={`Whenever someone comments on this discussion \n it will show up here.`}
        page='Discussions'
        />
      )
    }
  }
  render() {
    const { id, topic, followers, privacy } = this.props;
    const options = {
      body: {
        discussion_id: id,
      },
      url: 'comment.list',
      resPath: 'comments',
      limit: 10,
    };

    return (
      <SWView
        header={<DiscussionHeader
          topic={topic}
          id={id}
          followers={followers}
          privacy={privacy}
        />}
        footer={this.renderFooter()}
      >
        <PaginationProvider options={options}>
          {this.renderComments}
        </PaginationProvider>
      </SWView>
    );
  }
}
