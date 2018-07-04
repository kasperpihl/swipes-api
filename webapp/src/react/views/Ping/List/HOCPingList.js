import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PingList from './PingList';
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
  componentDidMount() {
    const { request, orgId } = this.props;
    if(!this.state.results) {
      request('ping.list', {
        type: 'sent',
        skip: this.state.skip,
        limit: LIMIT,
        organization_id: orgId,
      }).then((res) => {
        if(res.ok) {
          this.setState({
            results: res.pings,
          });
        }
        console.log(res);
      });
    }
  }
  render() {
    const { results } = this.state;

    if(!results) {
      return <div>Loading</div>;
    }
    return (
      <PingList items={results} />
    );
  }
}