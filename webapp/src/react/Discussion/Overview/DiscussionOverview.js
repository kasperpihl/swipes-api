import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import SW from './DiscussionOverview.swiss';
import EmptyState from 'src/react/_components/EmptyState/EmptyState';
import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentItem from 'src/react/Comment/Item/CommentItem';
import SWView from 'src/react/_Layout/view-controller/SWView';
import withPagination from 'swipes-core-js/components/pagination/withPagination';
import PaginationScrollToMore from 'src/react/_components/pagination/PaginationScrollToMore';

@withPagination
export default class DiscussionOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.checkForScrollToBottom(props);
  }
  componentDidMount() {
    this.doScrollToBottom();
  }
  componentWillReceiveProps(nextProps) {
    this.checkForScrollToBottom(nextProps);
  }
  componentDidUpdate() {
    this.doScrollToBottom();
  }
  checkForScrollToBottom(props) {
    // Before render, let's look at situation and determine scroll.
    // Assume scroll to bottom
    this.shouldScrollToBottom = true;
    if (this.scroller) {
      const { scrollTop, clientHeight, scrollHeight } = this.scroller;
      const scrollPos = scrollHeight - clientHeight - scrollTop;
      // If scrollPos is 0 (bottom), we should keep scroll to the bottom!
      // If scrollPos is not 0 (not bottom)
      if (scrollPos > 0) {
        // Do not auto scroll to bottom
        this.shouldScrollToBottom = false;
        // Check if the first item has changed, then the new items is above
        // and we should compensate for the scroll.
        const first = props.pagination.results.last();
        if (first && first.get('comment_id') !== this.oldestElementId) {
          this.oldestElementId = first.get('comment_id');
          this.lastHeight = scrollHeight;
          this.lastScrollTop = scrollTop;
        }
      }
    }
  }
  doScrollToBottom() {
    if (this.shouldScrollToBottom) {
      const { clientHeight, scrollHeight } = this.scroller;
      this.scroller.scrollTop = scrollHeight - clientHeight;
    } else if (this.lastHeight) {
      // Compensate for the new items above.
      const { clientHeight, scrollHeight } = this.scroller;
      this.scroller.scrollTop =
        this.lastScrollTop + (scrollHeight - this.lastHeight);
      this.lastHeight = undefined;
    }
  }
  renderFooter() {
    const { discussion } = this.props;
    return (
      <SW.FooterWrapper>
        <CommentComposer discussion={discussion} />
      </SW.FooterWrapper>
    );
  }
  renderComments() {
    const { pagination, discussion } = this.props;
    const results = (pagination.results || fromJS([])).reverse().toArray();
    return (
      <SW.CommentWrapper>
        <PaginationScrollToMore errorLabel="Couldn't get discussions." />
        {results.map((comment, i) => (
          <CommentItem
            key={i}
            comment={comment}
            discussionId={discussion.get('discussion_id')}
            ownedBy={discussion.get('owned_by')}
          />
        ))}
        {pagination.results && !pagination.results.size && (
          <EmptyState
            showIcon
            title="IT’S STILL AND QUIET"
            description={`Whenever someone comments on this discussion \n it will show up here.`}
          />
        )}
      </SW.CommentWrapper>
    );
  }
  render() {
    const { discussion, onClickAttachments, viewAttachments } = this.props;

    return (
      <SWView
        header={
          <DiscussionHeader
            discussion={discussion}
            onClickAttachments={onClickAttachments}
            viewAttachments={viewAttachments}
          />
        }
        footer={this.renderFooter()}
        scrollRef={c => {
          this.scroller = c;
        }}
        onScroll={this.onScroll}
      >
        {this.renderComments()}
      </SWView>
    );
  }
}
