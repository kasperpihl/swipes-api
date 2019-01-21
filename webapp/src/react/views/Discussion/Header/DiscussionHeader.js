import React, { PureComponent, Fragment } from 'react';
import {
  setupLoading,
  miniIconForId,
  navForContext
} from 'swipes-core-js/classes/utils';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/components/FormModal/FormModal';
import SW from './DiscussionHeader.swiss';
import Button from 'src/react/components/Button/Button';
import Attachment from 'src/react/components/attachment/Attachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import AssigneeTooltip from 'src/react/components/assigning/AssigneeTooltip';
import request from 'swipes-core-js/utils/request';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('id')
  }),
  {
    tooltip: mainActions.tooltip
  }
)
export default class DiscussionHeader extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }
  onMouseEnter = e => {
    const { tooltip, discussion } = this.props;
    if (!discussion.get('followers').size) return;
    console.log(discussion.get('followers').toJS());
    tooltip({
      component: AssigneeTooltip,
      props: {
        assignees: discussion.get('followers').map(f => f.get('user_id')),
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
            discussion_id: discussion.get('id'),
            topic: text
          });
        }
      }
    });
  };
  onArchive(options) {
    const { discussion, openModal } = this.props;
    openModal(FormModal, {
      title: 'Delete discussion',
      subtitle:
        'This will delete the discussion permanently and cannot be undone.',
      onConfirm: () => {
        this.setLoading('dots');
        request('discussion.archive', {
          discussion_id: discussion.get('id')
        }).then(res => {
          if (res.ok) {
            window.analytics.sendEvent('Discussion archived', {});
          }
          if (!res || !res.ok) {
            this.clearLoading('dots', '!Something went wrong');
          }
        });
      }
    });
  }
  onContextClick = () => {
    const { openSecondary, discussion } = this.props;
    openSecondary(navForContext(discussion.get('context')));
  };
  onFollowClick = () => {
    const { myId, discussion } = this.props;

    this.setLoading('following');
    let endpoint = 'discussion.follow';
    if (discussion.get('followers').find(o => o.get('user_id') === myId)) {
      endpoint = 'discussion.unfollow';
    }
    request(endpoint, {
      discussion_id: discussion.get('id')
    }).then(res => {
      this.clearLoading('following');
    });
  };
  render() {
    const { discussion, myId } = this.props;
    const followers = discussion.get('followers').map(o => o.get('user_id'));
    const topic = discussion.get('topic');
    const privacy = discussion.get('privacy');

    return (
      <Fragment>
        <CardHeader title={topic} delegate={this}>
          <Button.Rounded
            title={followers.includes(myId) ? 'Unfollow' : 'Follow'}
            onClick={this.onFollowClick}
            status={this.getLoading('following')}
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
