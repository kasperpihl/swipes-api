import React, { PureComponent, PropTypes } from 'react';
import { fromJS } from 'immutable';

import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate, randomString } from 'classes/utils';
import BrowseSectionList from './BrowseSectionList';

import './styles/browse.scss';

class HOCBrowse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      queries: fromJS([null]),
      results: fromJS([]),
      selectedIndexes: fromJS([]),
    };
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
    if (this.props.accountId) {
      this.fetchQuery();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      const { queries, results, selectedIndexes } = this.state;
      this.setState({
        queries: queries.clear().push(null),
        results: results.clear(),
        selectedIndexes: selectedIndexes.clear(),
      });
    }
  }
  scrollToEnd() {
    const { scroller } = this.refs;
    if (scroller) {
      const scrollW = scroller.scrollWidth;
      const clientW = scroller.clientWidth;
      scroller.scrollLeft = Math.max(scrollW - clientW, 0);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.queries !== this.state.queries) {
      this.fetchQuery();
      this.scrollToEnd();
    }
    if (prevState.results !== this.state.results) {
      this.scrollToEnd();
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  fetchQuery() {
    const {
      queries,
      results,
    } = this.state;
    const {
      serviceName,
      accountId,
    } = this.props;

    if (queries.size !== results.size) {
      const query = queries.last();
      const { request } = this.props;
      const qId = randomString(6);
      this._queryId = qId;

      request('find.browse', {
        service_name: serviceName,
        account_id: accountId,
        query,
      }).then((res) => {
        if (!this._unmounted && res && res.ok && qId === this._queryId) {
          this.setState({ results: results.push(res.result) });
        }
      });
    }
  }
  clickedItem(depth, id, i) {
    const { queries, results, selectedIndexes } = this.state;

    const r = results.get(depth).items[i];
    if (r && r.on_click.type === 'query') {
      const query = r.on_click.query;
      this.setState({
        queries: queries.setSize(depth + 1).push(query),
        results: results.setSize(depth + 1),
        selectedIndexes: selectedIndexes.setSize(depth).push(i),
      });
    } else if (r && r.on_click.type === 'preview') {
      this.callDelegate('onPreviewLink', Object.assign({}, r.on_click.preview, {
        meta: {
          title: r.title,
        },
      }));
    }
  }
  mapResults(items) {
    return items.map((item, i) => ({
      id: `id${i}`,
      title: item.title,
      leftIcon: item.left_icon,
      rightIcon: (item.on_click.type === 'query') ? 'ArrowRightLine' : undefined,
    }));
  }
  renderHorizontalSections() {
    const {
      queries,
      selectedIndexes,
      results,
    } = this.state;

    return queries.map((q, i) => {
      const r = results.get(i);
      let sections;
      if (r) {
        sections = [{
          title: r.title,
          items: this.mapResults(r.items),
        }];
      }

      const props = {
        depth: i,
        delegate: this,
        selectedId: `id${selectedIndexes.get(i)}`,
        loading: !r,
        sections,
      };
      return <BrowseSectionList key={i} {...props} />;
    });
  }
  render() {
    return (
      <div className="browse-horizontal-scroller" ref="scroller">
        {this.renderHorizontalSections()}
      </div>
    );
  }
}

const { func, object, string } = PropTypes;
HOCBrowse.propTypes = {
  request: func,
  delegate: object,
  accountId: string,
  serviceName: string,
  id: string,
};

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, {
  request: actions.api.request,
})(HOCBrowse);
