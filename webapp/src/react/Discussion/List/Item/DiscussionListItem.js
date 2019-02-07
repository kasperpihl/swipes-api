import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withNav from 'src/react/_hocs/Nav/withNav';

import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';
import orgGetBelonging from 'swipes-core-js/utils/org/orgGetBelonging';
import userGetFirstName from 'swipes-core-js/utils/user/userGetFirstName';

@withNav
@connect(state => ({
  myId: state.me.get('user_id')
}))
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick = () => {
    const { onSelectItemId, item } = this.props;
    onSelectItemId(item.get('discussion_id'));
  };
  render() {
    const {
      item,
      myId,
      selected,
      siblingToSelectedItem,
      compact,
      first,
      nav
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
        viewWidth={nav.width}
      >
        <SW.Wrapper onClick={this.onClick}>
          <SW.UnreadCircle />
          <SW.MiddleWrapper>
            <SW.Topic>{item.get('topic')}</SW.Topic>
            <SW.OrganizationName>
              {orgGetBelonging(item.get('owned_by'))}
            </SW.OrganizationName>
            <SW.Subtitle
              text={subtitle}
              maxLine="2"
              ellipsis="..."
              basedOn="letters"
            />
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>{timeGetDayOrTime(item.get('last_comment_at'))}</SW.Time>
          </SW.RightWrapper>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
