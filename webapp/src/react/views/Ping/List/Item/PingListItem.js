import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import Button from 'src/react/components/button/Button';
import withEmitter from 'src/react/components/emitter/withEmitter';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import * as mainActions from 'src/redux/main/mainActions';

import SW from './PingListItem.swiss';

@connect(null, {
  contextMenu: mainActions.contextMenu,
})
@withEmitter
export default class extends PureComponent {
  onReply = (e) => {
    const { contextMenu, item } = this.props;
    const items = [
      {
        id: 'ping',
        title: `Ping back ${msgGen.users.getFirstName(item.sent_by)}`,
        leftIcon: { icon: 'reply' },
      },
      {
        id: 'discuss',
        title: 'Turn into Discussion',
        leftIcon: { icon: 'Messages' },
      },
      
    ];

    const delegate = {
      onItemAction: (item) => {
        if(item.id === 'ping') {
          this.props.emit('ping-add-assignee', this.props.item.sent_by);
        }
        contextMenu(null);
      },
    };
    contextMenu({
      options: {
        boundingRect: e.target.getBoundingClientRect(),
      },
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });
  }
  onClick = () => {
  }
  getMessage(message) {

  }
  render() {
    const { item } = this.props;

    let sendString = msgGen.users.getFirstName(item.sent_by);
    sendString += ` pinged you`;

    return (
      <SW.Wrapper className="ButtonWrapper-hover">
        <HOCAssigning
          onClick={this.onClick}
          assignees={[item.sent_by]}
          size={36}
        />
        <SW.Message>
          <SW.Sender>
            {sendString}
            <SW.Time prefix=" - " date={item.sent_at} simple />
          </SW.Sender>
          <div>
            {parseLinks(parseNewLines(item.message))}
          </div>
        </SW.Message>
        <SW.ButtonWrapper>
          <Button
            icon="reply"
            onClick={this.onReply}
            compact
          />
          <Button
            icon="ThreeDots"
            compact
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
