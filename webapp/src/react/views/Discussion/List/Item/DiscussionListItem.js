import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { miniIconForId, navForContext } from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import Attachment from 'src/react/components/attachment/Attachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';
import userGetFirstName from 'swipes-core-js/utils/user/userGetFirstName';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('user_id')
  }),
  {
    contextMenu: mainActions.contextMenu,
    confirm: menuActions.confirm
  }
)
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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
    const firstName = userGetFirstName(
      item.get('last_comment_by'),
      item.get('owned_by')
    );
    const subtitle = `${firstName}: ${item.get('last_comment')}`;

    let unread = false;
    item.get('followers').forEach((ts, uId) => {
      if (uId === myId) {
        unread = ts === 'n' || ts < item.get('last_comment_at');
      }
    });

    return (
      <SW.ProvideContext
        selected={selected}
        unread={unread}
        siblingToSelectedItem={siblingToSelectedItem}
        first={first}
        compact={compact}
        viewWidth={viewWidth}
      >
        <SW.Wrapper onClick={this.onClick}>
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
      </SW.ProvideContext>
    );
  }
}
