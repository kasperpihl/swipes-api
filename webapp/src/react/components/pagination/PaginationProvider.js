import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import getDeep from 'swipes-core-js/utils/getDeep';
import * as ca from 'swipes-core-js/actions';
import { Provider } from './PaginationContext';

const DEFAULT_LIMIT = 20;

@connect(state => ({
  orgId: state.getIn(['me', 'organizations', 0, 'id'])
}), {
  request: ca.api.request,
})
export default class PaginationProvider extends PureComponent {
  constructor(props) {
    super(props);
    const { options } = props;
    this.state = {
      results: null,
      loadMore: this.loadMore,
      loading: false,
      hasMore: false,
    };
  }
  componentDidMount() {
    this.fetchResults();
  }
  loadMore = () => {
    this.fetchResults();
  }
  componentDidUpdate(prevProps) {
    if(this.props.options.body !== prevProps.options.body) {
      this.setState({
        results: null,
        hasMore: false,
      }, this.fetchResults);
    }
  }
  mergeResults(newResults) {
    const { results } = this.state;
    if(results) {
      return results.concat(newResults);
    }
    return newResults;
  }
  fetchResults = () => {
    const { orgId, request, options } = this.props;
    const { results, loading } = this.state;
    if(loading) return;
    const limit = options.limit || DEFAULT_LIMIT;
    this.setState({ loading: true });
    request(options.url, {
      skip: results ? results.length : 0,
      limit,
      ...options.body,
      organization_id: orgId,
    }).then((res) => {
      if(res && res.ok) {
        const newResults = getDeep(res, options.resPath || 'results');
        this.setState({
          results: this.mergeResults(newResults),
          hasMore: newResults.length === limit,
          loading: false,
        });
      } else this.setState({ loading: false });
    })
  }
  render() {
    return (
      <Provider value={Object.assign({}, this.state)}>
        {this.props.children}
      </Provider>
    );
  }
}