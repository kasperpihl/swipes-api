import React, { PureComponent, Fragment } from 'react';
import {
  setupLoading,
  miniIconForId,
  navForContext,
} from 'swipes-core-js/classes/utils';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import SW from './DiscussionHeader.swiss';
import Button from 'src/react/components/button/Button';
import Attachment from 'src/react/components/attachment/Attachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import InfoButton from 'components/info-button/InfoButton';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('id'),
  }),
  {
    inputMenu: menuActions.input,
    confirm: menuActions.confirm,
    openSecondary: navigationActions.openSecondary,
    request: ca.api.request,
  }
)
export default class DiscussionHeader extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }
  getInfoTabProps() {
    return {
      actions: [{ title: 'Delete', icon: 'Delete' }],
      about: {
        title: 'What is a discussion',
        text:
          'A discussion is used to get aligned with your team. Create them and tag people.',
      },
    };
  }
  onTitleClick = e => {
    const { inputMenu, discussion, request } = this.props;

    inputMenu(
      {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'right',
        text: discussion.get('topic'),
        buttonLabel: 'Rename',
      },
      text => {
        if (text !== discussion.get('topic') && text.length) {
          request('discussion.rename', {
            discussion_id: discussion.get('id'),
            topic: text,
          });
        }
      }
    );
  };
  onInfoTabAction(i, options, e) {
    this.onArchive(options);
  }
  onArchive(options) {
    const { discussion, confirm, request } = this.props;
    confirm(
      Object.assign({}, options, {
        title: 'Delete discussion',
        message:
          'This will delete the discussion permanently and cannot be undone.',
      }),
      i => {
        if (i === 1) {
          this.setLoading('dots');
          request('discussion.archive', {
            discussion_id: discussion.get('id'),
          }).then(res => {
            if (res.ok) {
              window.analytics.sendEvent('Discussion archived', {});
            }
            if (!res || !res.ok) {
              this.clearLoading('dots', '!Something went wrong');
            }
          });
        }
      }
    );
  }
  onContextClick = () => {
    const { openSecondary, discussion, target } = this.props;
    openSecondary(target, navForContext(discussion.get('context')));
  };
  onFollowClick = () => {
    const { request, myId, discussion } = this.props;

    this.setLoading('following');
    let endpoint = 'discussion.follow';
    if (discussion.get('followers').find(o => o.get('user_id') === myId)) {
      endpoint = 'discussion.unfollow';
    }
    request(endpoint, {
      discussion_id: discussion.get('id'),
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
        <HOCHeaderTitle title={topic}>
          {!discussion.get('topic_set') && (
            <Button title="Set topic" onClick={this.onTitleClick} />
          )}
          <Button
            title={followers.includes(myId) ? 'Unfollow' : 'Follow'}
            onClick={this.onFollowClick}
            {...this.getLoading('following')}
          />
          <InfoButton delegate={this} {...this.getLoading('dots')} />
        </HOCHeaderTitle>
        {discussion.get('context') && (
          <SW.ContextWrapper>
            <Attachment
              icon={miniIconForId(discussion.getIn(['context', 'id']))}
              title={discussion.getIn(['context', 'title'])}
              onClick={this.onContextClick}
              isContext
            />
          </SW.ContextWrapper>
        )}
      </Fragment>
    );
  }
}
