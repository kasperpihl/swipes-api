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
import useLoader from 'src/react/_hooks/useLoader';
import contextMenu from 'src/utils/contextMenu';

import SW from './DiscussionOverview.swiss';

import request from 'core/utils/request';
import useRequest from 'core/react/_hooks/useRequest';

import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

export default connect(
  state => ({
    myId: state.me.get('user_id')
  }),
  {
    tooltip: mainActions.tooltip
  }
)(DiscussionOverview);

function DiscussionOverview({ tooltip, discussionId, myId }) {
  const [attachmentsOnly, setAttachmentsOnly] = useState(false);
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

  const onMouseEnter = e => {
    const { discussion } = req.result;
    if (!Object.keys(discussion.followers).length) return;
    tooltip({
      component: TooltipUsers,
      props: {
        teamId: discussion.owned_by,
        userIds: Object.keys(discussion.followers),
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
    if (!Object.keys(discussion.followers).length) return;
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
    contextMenu(ListMenu, e, {
      onClick: onOptionClick,
      buttons: [
        { title: discussion.followers[myId] ? 'Unfollow' : 'Follow' },
        { title: 'Rename discussion' },
        { title: 'Delete discussion' }
      ]
    });
  };

  const onOptionClick = (i, e) => {
    if (e.title === 'Unfollow' || e.title === 'Follow') {
      this.onFollowClick();
    } else if (e.title === 'Delete discussion') {
      this.onArchiveClick();
    } else if (e.title === 'Rename discussion') {
      this.onTitleClick();
    }
  };
  const onFollowClick = () => {
    const { discussion } = req.result;

    loader.set('following');
    let endpoint = 'discussion.follow';
    if (discussion.followers[myId]) {
      endpoint = 'discussion.unfollow';
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
        // request('discussion.delete', {
        //   discussion_id: discussion.discussion_id
        // }).then(res => {
        //   if (res.ok) {
        //     window.analytics.sendEvent('Discussion archived', {});
        //   }
        //   if (!res || !res.ok) {
        //     loader.error('dots', res.error, 3000);
        //   }
        // }); TODO: Wire up correct endpoint once it's fixed by Kasper
      }
    });
  };
  const { discussion } = req.result;

  const subtitle = {
    ownedBy: discussion.owned_by,
    members: Object.keys(discussion.followers),
    privacy: 'public'
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
