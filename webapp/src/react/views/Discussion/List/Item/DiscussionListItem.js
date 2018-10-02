import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import SplitImage from 'src/react/components/split-image/SplitImage';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import { withOptimist } from 'react-optimist';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';

@withOptimist
@connect(
  state => ({
    myId: state.me.get('id'),
  }),
  {
    contextMenu: mainActions.contextMenu,
    confirm: menuActions.confirm,
    request: ca.api.request,
  }
)
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupLoading(this);
  }
  onClick = () => {
    const { onSelectItemId, item } = this.props;
    onSelectItemId(item.get('id'));
  };
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  onThreeDotsAction = (action, options) => {
    const { request } = this.props;
    this.setLoading('threedots');
    request(action, options).then(res => {
      if (!res.ok) {
        this.clearLoading('threedots', '!Something went wrong');
      } else {
        this.clearLoading('threedots');
      }
    });
  };
  onThreeDots = e => {
    const { contextMenu, confirm, myId, item } = this.props;
    const options = this.getOptionsForE(e);
    e.stopPropagation();
    const items = [];

    if (item.get('created_by') === myId) {
      items.push({
        id: 'archive',
        title: 'Delete discussion',
        subtitle:
          'The discussion will no longer be vissible to anyone in the organization.',
        action: 'discussion.archive',
        options: {
          discussion_id: item.get('id'),
        },
        confirm: 'This cannot be undone. Are you sure?',
      });
    }

    if (item.get('followers').find(o => o.get('user_id') === myId)) {
      items.push({
        id: 'unfollow',
        hideAfterClick: true,
        title: 'Unfollow',
        subtitle:
          'You will no longer receive notifications about this discussion',
        action: 'discussion.unfollow',
        options: {
          discussion_id: item.get('id'),
        },
      });
    } else {
      items.push({
        id: 'follow',
        hideAfterClick: true,
        title: 'Follow',
        subtitle:
          'You will start receiving notifications about this discussion',
        action: 'discussion.follow',
        options: {
          discussion_id: item.get('id'),
        },
      });
    }

    const delegate = {
      onItemAction: item => {
        if (item.confirm) {
          return confirm(
            Object.assign({}, options, {
              title: item.title,
              messege: item.confirm,
            }),
            i => {
              if (i === 1) {
                this.onThreeDotsAction(item.action, item.options);
              }
            }
          );
        }
        this.onThreeDotsAction(item.action, item.options);
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  };
  render() {
    const { item, myId, optimist } = this.props;

    const subtitle = `${msgGen.users.getName(item.get('last_comment_by'), {
      capitalize: true,
    })}: ${item.get('last_comment')}`;

    let unread = false;
    const subscriber = item
      .get('followers')
      .find(f => f.get('user_id') === myId);
    if (
      subscriber &&
      (!subscriber.get('read_at') ||
        subscriber.get('read_at') < item.get('last_comment_at'))
    ) {
      unread = true;
    }
    return (
      <SwissProvider
        selected={optimist.get('discussSelectedId') === item.get('id')}
        unread={unread}
      >
        <SW.Wrapper className="Button-hover" onClick={this.onClick}>
          <SW.LeftWrapper>
            <SplitImage
              size={48}
              users={item
                .get('followers')
                .map(o => o.get('user_id'))
                .toJS()}
            />
          </SW.LeftWrapper>
          <SW.MiddleWrapper>
            <SW.Topic>{item.get('topic')}</SW.Topic>
            <SW.Subtitle>{subtitle}</SW.Subtitle>
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>{timeGetDayOrTime(item.get('last_comment_at'))}</SW.Time>
            <SW.Button icon="ThreeDots" compact onClick={this.onThreeDots} />
          </SW.RightWrapper>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
