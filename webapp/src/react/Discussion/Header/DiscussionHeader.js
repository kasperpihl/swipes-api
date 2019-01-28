import React, { PureComponent, Fragment } from 'react';
import { miniIconForId } from 'swipes-core-js/classes/utils';
import withLoader from 'src/react/_hocs/withLoader';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/_components/FormModal/FormModal';
import SW from './DiscussionHeader.swiss';
import Button from 'src/react/_components/Button/Button';
import Attachment from 'src/react/_components/attachment/Attachment';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';
import request from 'swipes-core-js/utils/request';

@navWrapper
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
    if (!discussion.get('followers').size) return;
    console.log(discussion.get('followers').toJS());
    tooltip({
      component: TooltipUsers,
      props: {
        userIds: discussion.get('followers').map(f => f.get('user_id')),
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
  render() {
    const { discussion, myId, loader } = this.props;
    const topic = discussion.get('topic');
    const privacy = discussion.get('privacy');
    const followers = discussion.get('followers');

    return (
      <Fragment>
        <CardHeader title={topic} delegate={this}>
          <Button.Rounded
            title={followers.get(myId) ? 'Unfollow' : 'Follow'}
            onClick={this.onFollowClick}
            status={loader.get('following')}
          />
        </CardHeader>

        <SW.ContextWrapper>
          <SW.FollowerLabel
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {`${followers.size} follower${followers.size === 1 ? '' : 's'}`}
          </SW.FollowerLabel>
          {discussion.get('context') && (
            <Attachment
              icon={miniIconForId(discussion.getIn(['context', 'id']))}
              title={discussion.getIn(['context', 'title'])}
              onClick={this.onContextClick}
              isContext
            />
          )}
        </SW.ContextWrapper>
      </Fragment>
    );
  }
}
