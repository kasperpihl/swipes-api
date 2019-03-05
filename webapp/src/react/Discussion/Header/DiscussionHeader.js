import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/_components/FormModal/FormModal';
import SW from './DiscussionHeader.swiss';
import contextMenu from 'src/utils/contextMenu';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import withNav from 'src/react/_hocs/Nav/withNav';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';
import request from 'core/utils/request';

@withNav
@withLoader
@connect(
  state => ({
    myId: state.me.get('user_id')
  }),
  {
    tooltip: mainActions.tooltip
  }
)
export default class DiscussionHeader extends PureComponent {
  onMouseEnter = e => {
    const { tooltip, discussion } = this.props;
    if (!Object.keys(discussion.followers).length) return;
    tooltip({
      component: TooltipUsers,
      props: {
        organizationId: discussion.owned_by,
        userIds: Object.keys(discussion.followers),
        size: 24
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: 'right'
      }
    });
  };
  onMouseLeave = () => {
    const { tooltip, discussion } = this.props;
    if (!Object.keys(discussion.followers).length) return;
    tooltip(null);
  };
  onTitleClick = e => {
    const { nav, discussion } = this.props;
    nav.openModal(FormModal, {
      title: 'Rename discussion',
      inputs: [
        {
          placeholder: 'Title of discussion',
          initialValue: discussion.topic
        }
      ],
      confirmLabel: 'Rename',
      onConfirm: ([text]) => {
        if (text !== discussion.topic && text.length) {
          request('discussion.rename', {
            discussion_id: discussion.discussion_id,
            topic: text
          });
        }
      }
    });
  };
  onArchive() {
    const { discussion, nav, loader } = this.props;
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
  }
  openDiscussionOptions = e => {
    const { discussion, myId } = this.props;
    contextMenu(ListMenu, e, {
      onClick: this.onFollowClick,
      buttons: [{ title: discussion.followers[myId] ? 'Unfollow' : 'Follow' }]
    });
  };
  onFollowClick = () => {
    const { myId, discussion, loader } = this.props;

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
  render() {
    const {
      discussion,
      loader,
      onClickAttachments,
      attachmentsOnly
    } = this.props;
    const topic = discussion.topic;
    const subtitle = {
      ownedBy: discussion.owned_by,
      members: Object.keys(discussion.followers),
      privacy: 'public'
    };

    return (
      <SW.Wrapper>
        <CardHeader title={topic} subtitle={subtitle}>
          <SW.Button
            title={'See attachments'}
            icon="Eye"
            onClick={onClickAttachments}
            selected={attachmentsOnly}
          />
          <SW.Button
            icon="ThreeDots"
            onClick={this.openDiscussionOptions}
            status={loader.get('following')}
          />
        </CardHeader>
      </SW.Wrapper>
    );
  }
}
