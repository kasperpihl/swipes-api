import React, { Component, PropTypes } from 'react';
import { setupDelegate, randomString } from 'classes/utils';

import TabBar from 'components/tab-bar/TabBar';
import ResultList from './ResultList';

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
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
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
  renderSearchField() {
    const { search } = this.props;
    const { query } = this.state;

    if (!search) {
      return undefined;
    }

    return (
      <input type="text" className="tab-menu__search" placeholder={search} />
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
    const {
      tabs,
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

    let results = this.callDelegate.apply(null, params);
    results = [
      {
        leftIcon: {
          src: 'https://s3.amazonaws.com/uifaces/faces/twitter/andyvitale/128.jpg',
        },
        title: 'Stefan Vladimirov',
        subtitle: 'stefan@swipesapp.com',
        rightIcon: {
          button: {
            icon: 'Person',
          },
        },
      },
    ];

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
    return (
      <div className="tab-menu">
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
