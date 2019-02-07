import React, { PureComponent, Fragment } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/_components/FormModal/FormModal';
import SW from './DiscussionHeader.swiss';
import Button from 'src/react/_components/Button/Button';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';
import request from 'swipes-core-js/utils/request';

@navWrapper
@withLoader
@connect(
  (state, props) => ({
    myId: state.me.get('user_id'),
    organization: state.organizations.get(props.discussion.get('owned_by'))
  }),
  {
    tooltip: mainActions.tooltip
  }
)
export default class DiscussionHeader extends PureComponent {
  onMouseEnter = e => {
    const { tooltip, discussion } = this.props;
    if (!discussion.get('followers').size) return;
    tooltip({
      component: TooltipUsers,
      props: {
        organizationId: discussion.get('owned_by'),
        userIds: discussion.get('followers').keySeq(),
        size: 24
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: 'bottom'
      }
    });
  };
  onMouseLeave = () => {
    const { tooltip, discussion } = this.props;
    if (!discussion.get('followers').size) return;
    tooltip(null);
  };
  onTitleClick = e => {
    const { openModal, discussion } = this.props;
    openModal(FormModal, {
      title: 'Rename discussion',
      inputs: [
        {
          placeholder: 'Name of discussion',
          initialValue: discussion.get('topic')
        }
      ],
      confirmLabel: 'Rename',
      onConfirm: ([text]) => {
        if (text !== discussion.get('topic') && text.length) {
          request('discussion.rename', {
            discussion_id: discussion.get('discussion_id'),
            topic: text
          });
        }
      }
    });
  };
  onArchive(options) {
    const { discussion, openModal, loader } = this.props;
    openModal(FormModal, {
      title: 'Delete discussion',
      subtitle:
        'This will delete the discussion permanently and cannot be undone.',
      onConfirm: () => {
        loader.set('dots');
        request('discussion.archive', {
          discussion_id: discussion.get('user_id')
        }).then(res => {
          if (res.ok) {
            window.analytics.sendEvent('Discussion archived', {});
          }
          if (!res || !res.ok) {
            loader.clear('dots', res.error);
          }
        });
      }
    });
  }
  onContextClick = () => {
    const { openSecondary, discussion } = this.props;
    // openSecondary(navForContext(discussion.get('context')));
  };
  onFollowClick = () => {
    const { myId, discussion, loader } = this.props;

    loader.set('following');
    let endpoint = 'discussion.follow';
    if (discussion.get('followers').find((ts, uId) => uId === myId)) {
      endpoint = 'discussion.unfollow';
    }
    request(endpoint, {
      discussion_id: discussion.get('discussion_id')
    }).then(res => {
      loader.clear('following');
    });
  };
  renderSubtitle = () => {
    const { discussion, organization } = this.props;
    const followers = discussion.get('followers');
    const privacy = discussion.get('privacy');
    return (
      <>
        <SW.OrganizationName>{organization.get('name')} / </SW.OrganizationName>
        <SW.FollowerLabel
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <SW.Icon icon={privacy ? 'ThreeDots' : 'Earth'} />
          {/* TODO: Change icon once privacy is wired up */}
          {`${followers.size} follower${followers.size === 1 ? '' : 's'}`}
        </SW.FollowerLabel>
      </>
    );
  };
  render() {
    const { discussion, myId, loader } = this.props;
    const topic = discussion.get('topic');
    const followers = discussion.get('followers');

    return (
      <Fragment>
        <CardHeader
          title={topic}
          delegate={this}
          subtitle={this.renderSubtitle()}
        >
          <Button.Rounded
            title={followers.get(myId) ? 'Unfollow' : 'Follow'}
            onClick={this.onFollowClick}
            status={loader.get('following')}
          />
        </CardHeader>
        <SW.ContextWrapper>
          <SW.Button
            title="Put name of project here"
            icon="Comment"
            border
            leftAlign
          />
          <SW.Button title="See attachments" />
          <SW.Button icon="ThreeDots" />
        </SW.ContextWrapper>
      </Fragment>
    );
  }
}
