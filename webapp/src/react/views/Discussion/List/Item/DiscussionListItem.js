import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import SplitImage from 'src/react/components/split-image/SplitImage';
import moment from 'moment';

import SW from './DiscussionListItem.swiss';

export default class DiscussionListItem extends PureComponent {
  render() {
    const {
      group,
      title,
      last_at,
      last_by,
      last_message,
      unread,
    } = this.props.item;

    const subtitle = `${msgGen.users.getName(last_by, {
      capitalize: true,
    })}: ${last_message}`;

    return (
      <SwissProvider unread={unread}>
        <SW.Wrapper className="Button-hover">
          <SW.LeftWrapper>
            <SplitImage size={48} users={group} />
          </SW.LeftWrapper>
          <SW.MiddleWrapper>
            <SW.Title>
              {title}
            </SW.Title>
            <SW.Subtitle>{subtitle}</SW.Subtitle>
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>{moment(last_at).format('LT')}</SW.Time>
            <SW.Button icon="ThreeDots" compact />
          </SW.RightWrapper>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
