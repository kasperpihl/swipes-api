import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import randomString from 'swipes-core-js/utils/randomString';
import Button from 'src/react/components/button/Button';
import TabBar from 'src/react/components/tab-bar/TabBar';
import ResultList from './ResultList';
import SW from './TabMenu.swiss';

class TabMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: -1,
      query: '',
      loading: false,
      results: props.items || []
    };
    if (typeof props.initialTabIndex === 'number') {
      this.state.tabIndex = props.initialTabIndex;
    }
    bindAll(this, ['onChangeQuery', 'emptySearch', 'onKeyDown', 'handleClick']);
    setupDelegate(
      this,
      'onTabMenuLoad',
      'onActionClick',
      'onItemAction',
      'getNumberOfTabs',
      'getNameForTab'
    );
  }
  componentDidMount() {
    this.onTabMenuLoad(this);
    const { search } = this.props;
    if (search) {
      this.search.focus();
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
    this.onActionClick();
    hide();
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      const { results } = this.state;
      if (results.length) {
        this.onItemAction(results[0], 'enter', e);
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
        results: items
      });
      return;
    }
    const { tabIndex, query, loading } = this.state;

    if (!loading) {
      this.setState({
        loading: true,
        results: []
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
      <SW.Search>
        <SW.Input
          type="text"
          innerRef={c => {
            this.search = c;
          }}
          placeholder={search}
          onKeyDown={this.onKeyDown}
          onChange={this.onChangeQuery}
          value={query}
        />
        <SW.Button
          icon="Close"
          className="close"
          compact
          onClick={this.emptySearch}
        />
      </SW.Search>
    );
  }
  renderTabBar() {
    const { tabIndex } = this.state;

    this.numberOfTabs = this.getNumberOfTabs();

    if (typeof this.numberOfTabs !== 'number') {
      return undefined;
    }

    const tabs = [];
    for (let i = 0; i < this.numberOfTabs; i += 1) {
      let title = this.getNameForTab(i);
      if (typeof title !== 'string' || !title.length) {
        title = `Tab #${i}`;
      }
      tabs.push(title);
    }

    return <TabBar tabs={tabs} activeTab={tabIndex} delegate={this} />;
  }
  resultsCallback(qId, results) {
    if (this.qId && qId === this.qId) {
      this.setState({
        results,
        loading: false
      });
    }
  }

  renderResultList() {
    const { results, loading } = this.state;
    const { delegate, hide } = this.props;

    return (
      <ResultList
        delegate={delegate}
        results={results}
        loading={loading}
        hide={hide}
      />
    );
  }
  renderHeader() {
    return (
      <SW.Header>
        <SW.Section>{this.renderSearchField()}</SW.Section>
        <div className="tabBar">{this.renderTabBar()}</div>
      </SW.Header>
    );
  }
  renderFooter() {
    const { actionLabel, actionStatus } = this.props;

    if (!actionLabel) {
      return undefined;
    }

    return (
      <SW.Footer>
        <SW.Status>{actionStatus}</SW.Status>
        <SW.Actions>
          <Button title={actionLabel} onClick={this.handleClick} />
        </SW.Actions>
      </SW.Footer>
    );
  }
  render() {
    const { search, style, className: cN } = this.props;
    const { query } = this.state;
    let searching;
    let dynamicHeight;

    {
      query.length ? (searching = true) : undefined;
    }

    this.numberOfTabs = this.getNumberOfTabs();

    {
      typeof this.numberOfTabs !== 'number' && !search
        ? (dynamicHeight = true)
        : undefined;
    }

    return (
      <SW.Wrapper searching={searching} dynamicHeight={dynamicHeight}>
        {this.renderHeader()}
        {this.renderResultList()}
        {this.renderFooter()}
      </SW.Wrapper>
    );
  }
}

export default TabMenu;

const { object, string, arrayOf, number } = PropTypes;

TabMenu.propTypes = {
  style: object,
  className: string,
  search: string,
  initialTabIndex: number,
  items: arrayOf(object),
  delegate: object.isRequired,
  actionLabel: string
};
