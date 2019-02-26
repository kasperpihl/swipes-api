import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentList from 'src/react/Comment/List/CommentList';
import SWView from 'src/react/_Layout/view-controller/SWView';

import SW from './DiscussionOverview.swiss';

import request from 'core/utils/request';
import useRequest from 'core/react/_hooks/useRequest';

import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

export default connect(state => ({
  myId: state.me.get('user_id')
}))(DiscussionOverview);

function DiscussionOverview({ discussionId, myId }) {
  const [attachmentsOnly, setAttachmentsOnly] = useState(false);
  const scrollRef = useRef();

  const req = useRequest(
    'discussion.get',
    {
      discussion_id: discussionId
    },
    result => {
      const { discussion } = result;
      const ts = discussion.followers[myId];
      if (ts === 'n' || ts < discussion.last_comment_at) {
        request('discussion.markAsRead', {
          read_at: discussion.last_comment_at,
          discussion_id: discussion.discussion_id
        });
      }
    }
  );

  if (req.loading || req.error) {
    return <RequestLoader req={req} />;
  }

  const handleClick = () => {
    setAttachmentsOnly(c => !c);
  };
  const { discussion } = req.result;

  return (
    <SWView
      header={
        <DiscussionHeader
          discussion={discussion}
          onClickAttachments={handleClick}
          attachmentsOnly={attachmentsOnly}
        />
      }
      footer={
        <SW.FooterWrapper>
          <CommentComposer discussion={discussion} />
        </SW.FooterWrapper>
      }
      scrollRef={c => {
        scrollRef.current = c;
      }}
      // onScroll={this.onScroll}
    >
      <CommentList
        attachmentsOnly={attachmentsOnly}
        key={`${attachmentsOnly}`}
        discussion={discussion}
      />
    </SWView>
  );
}
