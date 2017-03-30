import React, { Component, PropTypes } from 'react';
import { setupDelegate, randomString, bindAll } from 'swipes-core-js/classes/utils';
import Button from 'Button';
import TabBar from 'components/tab-bar/TabBar';
import ResultList from './ResultList';

import './styles/tab-menu.scss';

class TabMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: -1,
      query: '',
      loading: false,
      results: [],
    };
    if (typeof props.initialTabIndex === 'number') {
      this.state.tabIndex = props.initialTabIndex;
    }
    bindAll(this, ['onChangeQuery', 'emptySearch', 'onKeyDown', 'handleClick']);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('onTabMenuLoad', this);
    const { search } = this.props;
    if (search) {
      this.refs.search.focus();
    }
    this.reload();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.tabIndex !== this.state.tabIndex
    ) {
      this.reload();
    }
  }
  componentWillUnmount() {
    this.qId = undefined;
  }
  handleClick() {
    const { hide } = this.props;
    this.callDelegate('onActionClick');
    hide();
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      const { results } = this.state;
      if (results.length) {
        this.callDelegate('onItemAction', results[0], 'enter', e);
      }
    }
  }
  onChangeQuery(e) {
    let { query } = this.state;
    if (query !== e.target.value) {
      query = e.target.value;
      this.setState({ query });
    }
  }
  tabDidChange(index) {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }

  reload() {
    const { items } = this.props;
    if (items) {
      this.setState({
        results: items,
      });
      return;
    }
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
    let params = ['resultsForAll', callback];

    if (query.length) {
      params = ['resultsForSearch', query, callback];
    } else if (this.numberOfTabs) {
      params = ['resultsForTab', tabIndex, callback];
    }

    const results = this.callDelegate.apply(null, params);

    if (results) {
      this.resultsCallback(this.qId, results);
      this.qId = undefined;
      this.setState({ loading: false });
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
          onKeyDown={this.onKeyDown}
          onChange={this.onChangeQuery}
          value={query}
        />
        <Button icon="Close" className="tab-menu__close" frameless onClick={this.emptySearch} />
      </div>
    );
  }
  renderTabBar() {
    const { tabIndex } = this.state;

    this.numberOfTabs = this.callDelegate('numberOfTabs');

    if (typeof this.numberOfTabs !== 'number') {
      return undefined;
    }

    const tabs = [];
    for (let i = 0; i < this.numberOfTabs; i += 1) {
      let title = this.callDelegate('nameForTab', i);
      if (typeof title !== 'string' || !title.length) {
        title = `Tab #${i}`;
      }
      tabs.push(title);
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

  renderResultList() {
    const {
      results,
      loading,
    } = this.state;
    const { delegate } = this.props;

    return (
      <ResultList
        delegate={delegate}
        results={results}
        loading={loading}
      />
    );
  }
  renderHeader() {
    return (
      <div className="tab-menu__header">
        <div className="tab-menu__section">
          {this.renderSearchField()}
        </div>
        <div className="tab-menu__section tab-menu__section--tab-bar">
          {this.renderTabBar()}
        </div>
      </div>
    );
  }
  renderFooter() {
    const { actionLabel, actionStatus } = this.props;

    if (!actionLabel) {
      return undefined;
    }

    return (
      <div className="tab-menu__footer">
        <div className="tab-menu__status">
          {actionStatus}
        </div>
        <div className="tab-menu__actions">
          <Button text={actionLabel} primary onClick={this.handleClick} />
        </div>
      </div>
    );
  }
  render() {
    const { search, initialTabIndex, items, delegate, actionLabel, ...rest } = this.props;
    const { query } = this.state;
    let className = 'tab-menu';

    if (query.length) {
      className += ' tab-menu--is-searching';
    }

    this.numberOfTabs = this.callDelegate('numberOfTabs');

    if (typeof this.numberOfTabs !== 'number' && !search) {
      className += ' tab-menu--dynamic-height';
    }

    return (
      <div className={className} {...rest}>
        {this.renderHeader()}
        {this.renderResultList()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default TabMenu;

const { object, string, arrayOf, number } = PropTypes;

TabMenu.propTypes = {
  search: string,
  initialTabIndex: number,
  items: arrayOf(object),
  delegate: object.isRequired,
  actionLabel: string,
};
