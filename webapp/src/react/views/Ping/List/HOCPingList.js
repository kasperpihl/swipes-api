import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PingList from './PingList';
import PaginationProvider from 'src/react/components/pagination/PaginationProvider';
import * as ca from 'swipes-core-js/actions';

const LIMIT = 20;

@connect(state => ({
  orgId: state.getIn(['me', 'organizations', 0, 'id'])
}), {
  request: ca.api.request,
})
export default class HOCPingList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      results: null,
    };
  }
  // componentDidMount() {
  //   const { request, orgId } = this.props;
  //   if(!this.state.results) {
  //     request('ping.list', {
  //       type: 'sent',
  //       skip: this.state.skip,
  //       limit: LIMIT,
  //       organization_id: orgId,
  //     }).then((res) => {
  //       if(res.ok) {
  //         this.setState({
  //           results: res.pings,
  //         });
  //       }
  //     });
  //   }
  // }
  render() {
    return (
      <PaginationProvider options={{
        body: {
          type: this.props.activeItem === 1 ? 'sent' : 'received',
        },
        url: 'ping.list',
        resPath: 'pings',
        limit: 3,
      }}>
        <PingList setActiveItem={this.props.setActiveItem}/>
      </PaginationProvider>
    );
  }
}