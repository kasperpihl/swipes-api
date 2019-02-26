import React, { PureComponent } from 'react';
import SW from './DiscussionOverview.swiss';

import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentList from 'src/react/Comment/List/CommentList';
import CardContent from 'src/react/_components/Card/Content/CardContent';

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
        // const first = props.pagination.results.last();
        // if (first && first.get('comment_id') !== this.oldestElementId) {
        //   this.oldestElementId = first.get('comment_id');
        //   this.lastHeight = scrollHeight;
        //   this.lastScrollTop = scrollTop;
        // }
      }
    }
  }
  doScrollToBottom() {
    if (this.shouldScrollToBottom) {
      const { clientHeight, scrollHeight } = this.scroller;
      this.scroller.scrollTop = scrollHeight - clientHeight;
    } else if (this.lastHeight) {
      // Compensate for the new items above.
      const { scrollHeight } = this.scroller;
      this.scroller.scrollTop =
        this.lastScrollTop + (scrollHeight - this.lastHeight);
      this.lastHeight = undefined;
    }
  }

  render() {
    const { discussion, onClickAttachments, viewAttachments } = this.props;

    return (
      <CardContent
        header={
          <DiscussionHeader
            discussion={discussion}
            onClickAttachments={onClickAttachments}
            viewAttachments={viewAttachments}
          />
        }
        footer={
          <SW.FooterWrapper>
            <CommentComposer discussion={discussion} />
          </SW.FooterWrapper>
        }
        scrollRef={c => {
          this.scroller = c;
        }}
        onScroll={this.onScroll}
      >
        <CommentList
          attachmentsOnly={viewAttachments}
          key={`${viewAttachments}`}
          discussion={discussion}
        />
      </CardContent>
    );
  }
}
