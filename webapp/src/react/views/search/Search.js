import React, { PureComponent } from 'react';

import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';

import Icon from 'Icon';
import './styles/search.scss';
import HOCSearchResults from './HOCSearchResults';

class Search extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onChange', 'onScroll');
  }
  renderSearchField() {
    const { searchString } = this.props;

    return (
      <div className="search__field">
        <input type="text"
          autoFocus
          placeholder="Search for plans, goals and posts"
          value={searchString}
          onChange={this.onChange}
        />
      </div>
    )

  }
  renderResults() {
    const { searchString, limit, delegate } = this.props;
    return (
      <HOCSearchResults
        searchString={searchString}
        limit={limit}
        delegate={delegate}
      />
    )
  }
  render() {
    const { initialScroll } = this.props;

    return (
      <SWView
        header={this.renderSearchField()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        {this.renderResults()}
      </SWView>

    );
  }
}

export default Search
