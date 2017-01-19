import React, { Component, PropTypes } from 'react';
import { setupDelegate, randomString, bindAll } from 'classes/utils';

import TabBar from 'components/tab-bar/TabBar';
import ResultList from './ResultList';
import Button from 'Button';

import './styles/tab-menu.scss';

class TabMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      query: '',
      loading: false,
      results: [],
    };
    if (typeof props.initialTabIndex === 'number') {
      this.state.tabIndex = props.initialTabIndex;
    }
    bindAll(this, ['onChangeQuery', 'emptySearch']);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('onTabMenuLoad', this);
    const { search } = this.props;
    if (search) {
      this.refs.search.focus();
    }
    this.fetchResults();
  }
  componentWillUnmount() {
    this.qId = undefined;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.tabIndex !== this.state.tabIndex
    ) {
      this.fetchResults();
    }
  }
  tabDidChange(nav, index) {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }
  onChangeQuery(e) {
    let { query } = this.state;
    if (query !== e.target.value) {
      query = e.target.value;
      this.setState({ query });
    }
  }
  emptySearch() {
    const { query } = this.state;

    if (query.length) {
      this.setState({ query: '' });
    }
  }
  renderSearchField() {
    const { search } = this.props;
    const { query } = this.state;

    if (!search) {
      return undefined;
    }

    return (
      <div className="tab-menu__search">
        <input
          type="text"
          ref="search"
          className="tab-menu__input"
          placeholder={search}
          onChange={this.onChangeQuery}
          value={query}
        />
        <Button icon="Close" className="tab-menu__close" frameless onClick={this.emptySearch} />
      </div>
    );
  }
  renderTabBar() {
    const { tabs } = this.props;
    const { tabIndex } = this.state;
    if (!tabs || !tabs.length) {
      return undefined;
    }
    return (
      <TabBar
        tabs={tabs}
        activeTab={tabIndex}
        delegate={this}
      />
    );
  }
  resultsCallback(qId, results) {
    if (this.qId && qId === this.qId) {
      this.setState({
        results,
        loading: false,
      });
    }
  }
  fetchResults() {
    const { tabs } = this.props;
    const {
      tabIndex,
      query,
      loading,
    } = this.state;

    if (!loading) {
      this.setState({
        loading: true,
        results: [],
      });
    }

    // Setup id to make sure we get the latest.
    this.qId = randomString(6);
    const callback = this.resultsCallback.bind(this, this.qId);
    let params = ['onResults', callback];

    if (query.length) {
      params = ['onSearchResults', query, callback];
    } else if (tabs && tabs.length) {
      params = ['onTabResults', tabIndex, callback];
    }

    const results = this.callDelegate.apply(null, params);

    if (results) {
      this.resultsCallback(this.qId, results);
      this.qId = undefined;
      this.setState({ loading: false });
    }
  }
  renderResultList() {
    const {
      results,
      loading,
    } = this.state;

    return (
      <ResultList
        results={results}
        loading={loading}
      />
    );
  }
  render() {
    const { query } = this.state;
    let className = 'tab-menu';

    if (query.length) {
      className += ' tab-menu--is-searching';
    }

    return (
      <div className={className}>
        {this.renderSearchField()}
        {this.renderTabBar()}
        {this.renderResultList()}
      </div>
    );
  }
}

export default TabMenu;

const { object, string, arrayOf, number } = PropTypes;

TabMenu.propTypes = {
  search: string,
  initialTabIndex: number,
  tabs: arrayOf(string),
  // delegate: object.isRequired,
};
