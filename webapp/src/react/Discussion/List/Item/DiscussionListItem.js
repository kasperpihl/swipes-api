import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';
import orgGetBelonging from 'swipes-core-js/utils/org/orgGetBelonging';
import userGetFirstName from 'swipes-core-js/utils/user/userGetFirstName';

@connect(state => ({
  myId: state.me.get('user_id')
}))
export default class DiscussionListItem extends PureComponent {
  onClick = () => {
    const { onSelectItemId, item } = this.props;
    onSelectItemId(item.discussion_id);
  };
  render() {
    const {
      item,
      myId,
      selected,
      siblingToSelectedItem,
      compact,
      first
    } = this.props;

    const firstName = userGetFirstName(item.last_comment_by, item.owned_by);
    const subtitle = `${firstName}: ${item.last_comment}`;

    const ts = item.followers[myId];
    const unread = ts === 'n' || ts < item.last_comment_at;

    return (
      <SW.ProvideContext
        selected={selected}
        unread={unread}
        siblingToSelectedItem={siblingToSelectedItem}
        first={first}
        compact={compact}
      >
        <SW.Wrapper onClick={this.onClick}>
          <SW.UnreadCircle />
          <SW.MiddleWrapper>
            <SW.Topic>{item.topic}</SW.Topic>
            <SW.OrganizationName>
              {orgGetBelonging(item.owned_by)}
            </SW.OrganizationName>
            <SW.Subtitle
              text={subtitle}
              maxLine="2"
              ellipsis="..."
              basedOn="letters"
            />
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>{timeGetDayOrTime(item.last_comment_at)}</SW.Time>
          </SW.RightWrapper>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
