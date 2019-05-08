import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import * as mainActions from 'src/redux/main/mainActions';

import request from 'core/utils/request';
import contextMenu from 'src/utils/contextMenu';

import useUpdate from 'core/react/_hooks/useUpdate';
import useNav from 'src/react/_hooks/useNav';
import useMyId from 'core/react/_hooks/useMyId';
import useLocalStorageCache from 'src/react/_hooks/useLocalStorageCache';
import useLoader from 'src/react/_hooks/useLoader';
import useRequest from 'core/react/_hooks/useRequest';

import CardHeader from '_shared/Card/Header/CardHeader';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentList from 'src/react/Comment/List/CommentList';
import CardContent from '_shared/Card/Content/CardContent';
import ListMenu from '_shared/ListMenu/ListMenu.js';
import Button from '_shared/Button/Button';
import AssignMenu from '_shared/AssignMenu/AssignMenu';
import RequestLoader from '_shared/RequestLoader/RequestLoader';
import FormModal from '_shared/FormModal/FormModal';

import SW from './DiscussionOverview.swiss';

export default connect(
  null,
  {
    tooltip: mainActions.tooltip
  }
)(DiscussionOverview);

function DiscussionOverview({ tooltip, discussionId }) {
  const myId = useMyId();
  const [attachmentsOnly, setAttachmentsOnly] = useState(false);
  const [initialMessage, saveMessage] = useLocalStorageCache(
    `${discussionId}-message`
  );
  const [initialAttachments, saveAttachments] = useLocalStorageCache(
    `${discussionId}-attachments`
  );

  const scrollRef = useRef();
  const nav = useNav();
  const loader = useLoader();

  const req = useRequest(
    'discussion.get',
    {
      discussion_id: discussionId
    },
    result => {
      const { discussion } = result;
      const ts = discussion.members[myId];
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
  const onTitleClick = e => {
    const { discussion } = req.result;
    nav.openModal(FormModal, {
      title: 'Rename chat',
      inputs: [
        {
          placeholder: 'Title of chat',
          initialValue: discussion.title,
          autoFocus: true
        }
      ],
      confirmLabel: 'Rename',
      onConfirm: ([text]) => {
        if (text !== discussion.title && text.length) {
          request('discussion.rename', {
            discussion_id: discussion.discussion_id,
            title: text
          });
        }
      }
    });
  };
  const openDiscussionOptions = e => {
    const { discussion } = req.result;
    const buttons = [
      { title: discussion.members[myId] ? 'Unfollow' : 'Follow' },
      { title: 'Rename chat' },
      { title: 'Delete chat' }
    ];
    contextMenu(ListMenu, e, {
      onClick: onOptionClick,
      buttons
    });
  };

  const onOptionClick = (i, e) => {
    if (e.title === 'Unfollow' || e.title === 'Follow') {
      onFollowClick();
    } else if (e.title === 'Delete chat') {
      onArchiveClick();
    } else if (e.title === 'Rename chat') {
      onTitleClick();
    }
  };
  const onFollowClick = () => {
    const { discussion } = req.result;

    loader.set('following');
    let endpoint = 'discussion.join';
    if (discussion.members[myId]) {
      endpoint = 'discussion.leave';
    }
    request(endpoint, {
      discussion_id: discussion.discussion_id
    }).then(res => {
      loader.clear('following');
    });
  };
  const onArchiveClick = () => {
    const { discussion } = req.result;
    nav.openModal(FormModal, {
      title: 'Delete chat',
      subtitle: 'This will delete the chat permanently and cannot be undone.',
      onConfirm: () => {
        loader.set('dots');
        request('discussion.delete', {
          discussion_id: discussion.discussion_id
        }).then(res => {
          if (res.ok) {
            window.analytics.sendEvent('Chat archived');
          }
          if (!res || !res.ok) {
            loader.error('dots', res.error, 3000);
          }
        });
      }
    });
  };

  const openAssignMenu = e => {
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      title: 'Add people',
      hideRowOnSelect: true,
      selectedIds: Object.keys(discussion.members),
      teamId: discussion.owned_by,
      onSelect: memberId => {
        request('discussion.addMember', {
          discussion_id: discussion.discussion_id,
          target_user_id: memberId
        });
      }
    });
  };

  const handleUnload = (message, attachments) => {
    saveMessage(message || null);
    saveAttachments(attachments.size ? attachments.toJS() : null);
  };

  const { discussion } = req.result;

  const subtitle = {
    ownedBy: discussion.owned_by,
    members: Object.keys(discussion.members),
    privacy: discussion.privacy,
    onClick: openAssignMenu
  };

  return (
    <CardContent
      header={
        <SW.HeaderWrapper>
          <CardHeader
            title={discussion.title}
            subtitle={subtitle}
            onTitleClick={onTitleClick}
            noSpacing
            separator
          >
            <Button
              title={'See attachments'}
              icon="Eye"
              onClick={handleClick}
              selected={attachmentsOnly}
            />
            <Button
              icon="ThreeDots"
              onClick={openDiscussionOptions}
              status={loader.get('following')}
            />
          </CardHeader>
        </SW.HeaderWrapper>
      }
      noframe
      footer={
        <SW.FooterWrapper>
          <CommentComposer
            onUnload={handleUnload}
            initialMessage={!!initialMessage ? initialMessage : ''}
            initialAttachments={initialAttachments}
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
