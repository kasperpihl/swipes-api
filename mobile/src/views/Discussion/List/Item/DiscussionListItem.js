import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SplitImage from 'components/SplitImage/SplitImage';
import RippleButton from 'RippleButton';
import SW from './DiscussionListItem.swiss';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  // apiRequest: ca.api.request,
})
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      followers,
      topic,
      last_comment,
      last_comment_at,
      last_comment_by,
      myId,
    } = this.props;
    const lastCommentByFirstName = msgGen.users.getFirstName(last_comment_by);
    let unread = false;
    const subscriber = followers.find(f => f.user_id === myId);
    if(subscriber && (!subscriber.read_at || subscriber.read_at < last_comment_at)) {
      unread = true;
    }

    return (
        <SW.Wrapper>
          <SW.LeftSide>
            <SplitImage followers={followers} size={40}></SplitImage>
          </SW.LeftSide>
          <SW.Middle>
            <SW.LineOfText numberOfLines={1} topic unread={unread}>
              {topic}
            </SW.LineOfText>
            <SW.LineOfText numberOfLines={1}>
              {lastCommentByFirstName}: {last_comment}
            </SW.LineOfText>
          </SW.Middle>
          <SW.RightSide>
            <SW.LineOfText alignRight time unread={unread}>
              {timeGetDayOrTime(last_comment_at)}
            </SW.LineOfText>
          </SW.RightSide>
        </SW.Wrapper>
    );
  }
}
