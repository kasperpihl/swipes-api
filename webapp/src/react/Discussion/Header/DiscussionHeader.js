import React, { PureComponent, Fragment } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/_components/FormModal/FormModal';
import SW from './DiscussionHeader.swiss';
import contextMenu from 'src/utils/contextMenu';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import withNav from 'src/react/_hocs/Nav/withNav';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import orgGetBelonging from 'swipes-core-js/utils/org/orgGetBelonging';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';
import request from 'swipes-core-js/utils/request';

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
          placeholder: 'Name of discussion',
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
  onArchive(options) {
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
  handleOpenContext = () => {
    const { nav, discussion } = this.props;
    nav.openRight({
      screenId: 'ProjectOverview',
      crumbTitle: 'Project',
      uniqueId: discussion.context_id,
      props: {
        projectId: discussion.context_id
      }
    });
  };
  onFollowClick = () => {
    const { myId, discussion, loader } = this.props;

    loader.set('following');
    let endpoint = 'discussion.follow';
    if (discussion.followers[my]) {
      endpoint = 'discussion.unfollow';
    }
    request(endpoint, {
      discussion_id: discussion.discussion_id
    }).then(res => {
      loader.clear('following');
    });
  };
  renderSubtitle = () => {
    const { discussion } = this.props;
    const followers = discussion.followers;
    const privacy = discussion.privacy;
    const numberOfFollowers = Object.keys(followers).length;
    return (
      <>
        <SW.OrganizationName>
          {orgGetBelonging(discussion.owned_by)} /{' '}
        </SW.OrganizationName>
        <SW.FollowerLabel
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <SW.Icon icon={privacy ? 'ThreeDots' : 'Earth'} />
          {/* TODO: Change icon once privacy is wired up */}
          {`${numberOfFollowers} follower${numberOfFollowers === 1 ? '' : 's'}`}
        </SW.FollowerLabel>
      </>
    );
  };
  render() {
    const {
      discussion,
      myId,
      loader,
      onClickAttachments,
      viewAttachments
    } = this.props;
    const topic = discussion.topic;

    return (
      <Fragment>
        <CardHeader title={topic} subtitle={this.renderSubtitle()} />
        <SW.ContextWrapper hasContext={!!discussion.context_id}>
          {discussion.context_id && (
            <SW.Button
              title={discussion.topic}
              onClick={this.handleOpenContext}
              icon="Milestones"
              border
              leftAlign
            />
          )}

          <SW.Button
            title={'See attachments'}
            onClick={onClickAttachments}
            icon={viewAttachments ? 'Eye' : undefined}
            viewAttachments={viewAttachments}
          />
          <SW.Button
            icon="ThreeDots"
            onClick={this.openDiscussionOptions}
            status={loader.get('following')}
          />
        </SW.ContextWrapper>
      </Fragment>
    );
  }
}
