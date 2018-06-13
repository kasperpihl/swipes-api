import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import Button from 'src/react/components/button/Button';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import withEmitter from 'src/react/components/emitter/withEmitter';

import styles from './PingListItem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Message = styleElement('div', styles.Message);
const Time = styleElement(TimeAgo, styles.Time);
const Sender = styleElement('div', styles.Sender);
const ButtonWrapper = styleElement('div', styles.ButtonWrapper).debug();

@withEmitter
export default class extends PureComponent {
  onClick = () => {
    this.props.emit('ping-add-assignee', this.props.item.sent_by);
  }
  getMessage(message) {

  }
  render() {
    const { item } = this.props;

    let sendString = msgGen.users.getFirstName(item.sent_by);
    sendString += ` pinged you`;

    return (
      <Wrapper className="ButtonWrapper-hover">
        <HOCAssigning
          onClick={this.onClick}
          assignees={[item.sent_by]}
          size={36}
        />
        <Message>
          <Sender>
            {sendString}
            <Time prefix=" - " date={item.sent_at} simple />
          </Sender>
          <div>
            {parseLinks(parseNewLines(item.message))}
          </div>
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
