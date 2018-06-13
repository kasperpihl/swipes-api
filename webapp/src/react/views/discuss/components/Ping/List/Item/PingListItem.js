import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button';
import TimeAgo from 'swipes-core-js/components/TimeAgo';

import styles from './PingListItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Message = styleElement('div', styles.Message);
const Time = styleElement(TimeAgo, styles.Time);
const Sender = styleElement('div', styles.Sender);
const ButtonWrapper = styleElement('div', styles.ButtonWrapper).debug();

export default class extends PureComponent {
  render() {
    const { item } = this.props;

    let sendString = msgGen.users.getFirstName(item.sent_by);
    sendString += ` pinged you`;
    return (
      <Wrapper className="ButtonWrapper-hover">
        <HOCAssigning
          assignees={[item.sent_by]}
          size={36}
        />
        <Message>
          <Sender>
            {sendString}
            <Time prefix=" - " date={item.sent_at} simple />
          </Sender>
          {item.message}
        </Message>
        <ButtonWrapper>
          <Button
            icon="reply"
            compact
          />
          <Button
            icon="ThreeDots"
            compact
          />
        </ButtonWrapper>
      </Wrapper>
    );
  }
}
