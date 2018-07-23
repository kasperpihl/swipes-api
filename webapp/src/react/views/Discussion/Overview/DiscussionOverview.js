import React, { PureComponent } from 'react';
import SW from './DiscussionOverview.swiss';
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
    const { discussionId } = this.props;
    return (
      <SW.FooterWrapper>
        <CommentComposer discussionId={discussionId}/>
      </SW.FooterWrapper>
    )
  }
  renderComments = (pagination) => {
    return (
      <SW.CommentWrapper>
        {(pagination.results || []).map((comment, i) => (
          <CommentItem key={i} comment={comment} />
        ))}
      </SW.CommentWrapper>
    )
    return <div>comments</div>
  }
  render() {
    const { discussionId } = this.props;
    const options = {
      body: {
        discussion_id: discussionId,
      },
      url: 'comment.list',
      resPath: 'comments',
      limit: 10,
    };

    return (
      <SWView
        header={<DiscussionHeader />}
        footer={this.renderFooter()}
      >
        <PaginationProvider options={options}>
          {this.renderComments}
        </PaginationProvider>
      </SWView>
    );
  }
}
