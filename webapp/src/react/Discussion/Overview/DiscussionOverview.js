import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import DiscussionHeader from '../Header/DiscussionHeader';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentList from 'src/react/Comment/List/CommentList';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import useUpdate from 'core/react/_hooks/useUpdate';

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

  useUpdate('discussion', update => {
    if (update.discussion_id === discussionId) {
      req.merge('discussion', update);
    }
  });

  if (req.loading || req.error) {
    return <RequestLoader req={req} />;
  }

  const handleClick = () => {
    setAttachmentsOnly(c => !c);
  };

  const handleSendMessage = () => {
    const el = scrollRef.current;
    el.scrollTop = el.scrollHeight - el.clientHeight;
  };
  const { discussion } = req.result;

  return (
    <CardContent
      header={
        <DiscussionHeader
          discussion={discussion}
          onClickAttachments={handleClick}
          attachmentsOnly={attachmentsOnly}
        />
      }
      footer={
        <SW.FooterWrapper>
          <CommentComposer
            discussionId={discussion.discussion_id}
            ownedBy={discussion.owned_by}
            onSuccess={handleSendMessage}
          />
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
        scrollRef={scrollRef}
      />
    </CardContent>
  );
}
