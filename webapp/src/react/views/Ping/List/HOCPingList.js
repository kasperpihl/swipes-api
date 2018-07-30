import React, { PureComponent } from 'react';
import PingList from './PingList';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';

export default class HOCPingList extends PureComponent {
  render() {
    return (
      <PaginationProvider
        request={{
          body: {
            type: this.props.activeItem === 1 ? 'sent' : 'received',
          },
          url: 'ping.list',
          resPath: 'pings',
        }}
        cache={{
          path: 'ping',
          orderby: '-sent_at'
        }}
      >
        <PingList setActiveItem={this.props.setActiveItem}/>
      </PaginationProvider>
    );
  }
}