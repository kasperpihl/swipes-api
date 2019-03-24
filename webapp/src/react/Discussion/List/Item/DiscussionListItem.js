import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import timeGetDayOrTime from 'core/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';
import teamGetBelonging from 'core/utils/team/teamGetBelonging';

@connect(state => ({
  myId: state.me.get('user_id')
}))
export default class DiscussionListItem extends PureComponent {
  onClick = () => {
    const { onSelectItemId, item } = this.props;
    onSelectItemId(item.discussion_id);
  };
  render() {
    const { item, myId, selected, showTeam } = this.props;

    const ts = item.followers[myId];
    const unread = ts === 'n' || ts < item.last_comment_at;

    return (
      <SW.ProvideContext selected={selected} unread={unread}>
        <SW.Wrapper onClick={this.onClick}>
          <SW.UnreadCircle />
          <SW.MiddleWrapper>
            <SW.Topic>{item.title}</SW.Topic>
            {showTeam && (
              <SW.TeamName>{teamGetBelonging(item.owned_by)}</SW.TeamName>
            )}
          </SW.MiddleWrapper>
          <SW.Time>{timeGetDayOrTime(item.last_comment_at)}</SW.Time>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
