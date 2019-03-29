import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

import * as mainActions from 'src/redux/main/mainActions';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from '_shared/Button/Button';
import CommentComposer from 'src/react/Comment/Composer/CommentComposer';
import CommentList from 'src/react/Comment/List/CommentList';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import useUpdate from 'core/react/_hooks/useUpdate';
import useNav from 'src/react/_hooks/useNav';
import useMyId from 'core/react/_hooks/useMyId';
import useLocalStorageCache from 'src/react/_hooks/useLocalStorageCache';
import useLoader from 'src/react/_hooks/useLoader';
import ListMenu from '_shared/ListMenu/ListMenu.js';
import AssignMenu from '_shared/AssignMenu/AssignMenu';
import FormModal from '_shared/FormModal/FormModal';
import contextMenu from 'src/utils/contextMenu';

import SW from './DiscussionOverview.swiss';

import request from 'core/utils/request';
import useRequest from 'core/react/_hooks/useRequest';

import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

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

  const onMouseEnter = e => {
    const { discussion } = req.result;
    if (!Object.keys(discussion.members).length) return;
    tooltip({
      component: TooltipUsers,
      props: {
        teamId: discussion.owned_by,
        userIds: Object.keys(discussion.members),
        size: 24
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: 'right'
      }
    });
  };
  const onMouseLeave = () => {
    const { discussion } = req.result;
    if (!Object.keys(discussion.members).length) return;
    tooltip(null);
  };
  const onTitleClick = e => {
    const { discussion } = req.result;
    nav.openModal(FormModal, {
      title: 'Rename discussion',
      inputs: [
        {
          placeholder: 'Title of discussion',
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
      { title: 'Rename discussion' },
      { title: 'Delete discussion' }
    ];
    contextMenu(ListMenu, e, {
      onClick: onOptionClick,
      buttons
    });
  };

  const onOptionClick = (i, e) => {
    if (e.title === 'Unfollow' || e.title === 'Follow') {
      onFollowClick();
    } else if (e.title === 'Delete discussion') {
      onArchiveClick();
    } else if (e.title === 'Rename discussion') {
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
      title: 'Delete discussion',
      subtitle:
        'This will delete the discussion permanently and cannot be undone.',
      onConfirm: () => {
        loader.set('dots');
        request('discussion.archive', {
          discussion_id: discussion.discussion_id
        }).then(res => {
          if (res.ok) {
            window.analytics.sendEvent('Discussion archived', {});
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
            initialMessage={initialMessage}
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
