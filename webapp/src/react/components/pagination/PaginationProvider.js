import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import getDeep from 'swipes-core-js/utils/getDeep';
import randomString from 'swipes-core-js/utils/randomString';
import * as ca from 'swipes-core-js/actions';
import { Provider, Consumer } from './PaginationContext';

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
      error: false,
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
      this.fetchId = null;
      this.setState({
        results: null,
        hasMore: false,
        loading: false,
      }, this.fetchResults);
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
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
    const fetchId = randomString(8);
    this.fetchId = fetchId;
    const limit = options.limit || DEFAULT_LIMIT;
    this.setState({ loading: true, error: false });
    request(options.url, {
      skip: results ? results.length : 0,
      limit,
      ...options.body,
      organization_id: orgId,
    }).then((res) => {
      if(this.fetchId !== fetchId || this._unmounted) return;
      if(res && res.ok) {
        const newResults = getDeep(res, options.resPath || 'results');
        this.setState({
          results: this.mergeResults(newResults),
          hasMore: newResults.length === limit,
          loading: false,
        });
      } else this.setState({ loading: false, error: true });
    })
  }
  renderChildren() {
    const { children } = this.props;
    if(typeof children !== 'function') {
      return children;
    }

    return (
      <Consumer>
        {pagination => children(pagination)}
      </Consumer>
    )
  }
  render() {
    return (
      <Provider value={Object.assign({}, this.state)}>
        {this.renderChildren()}
      </Provider>
    );
  }
}