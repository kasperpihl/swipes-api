import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { connect } from 'react-redux';
import {
  setupLoading,
  miniIconForId,
  navForContext
} from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import SplitImage from 'src/react/components/SplitImage/SplitImage';
import Attachment from 'src/react/components/attachment/Attachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('id')
  }),
  {
    contextMenu: mainActions.contextMenu,
    confirm: menuActions.confirm,
    request: ca.api.request
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
  onContextClick = () => {
    const { openSecondary, item } = this.props;
    openSecondary(navForContext(item.get('context')));
  };
  render() {
    const {
      item,
      myId,
      selected,
      siblingToSelectedItem,
      compact,
      first,
      viewWidth
    } = this.props;
    const subtitle = `${msgGen.users.getName(item.get('last_comment_by'), {
      capitalize: true
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
        selected={selected}
        unread={unread}
        siblingToSelectedItem={siblingToSelectedItem}
        first={first}
        compact={compact}
        viewWidth={viewWidth}
      >
        <SW.Wrapper onClick={this.onClick}>
          <SW.LeftWrapper>
            <SplitImage
              size={44}
              users={item.get('last_two_comments_by').toJS()}
            />
          </SW.LeftWrapper>
          <SW.MiddleWrapper>
            <SW.Topic>{item.get('topic')}</SW.Topic>
            <SW.Subtitle
              text={subtitle}
              maxLine="2"
              ellipsis="..."
              basedOn="letters"
            />
            {item.get('context') && (
              <SW.AttachmentWrapper>
                <Attachment
                  icon={miniIconForId(item.getIn(['context', 'id']))}
                  title={item.getIn(['context', 'title'])}
                  onClick={this.onContextClick}
                  isContext
                />
              </SW.AttachmentWrapper>
            )}
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>
              <SW.UnreadCircle />
              {timeGetDayOrTime(item.get('last_comment_at'))}
            </SW.Time>
          </SW.RightWrapper>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
