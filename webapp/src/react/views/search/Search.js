import React, { PureComponent } from 'react';
import HOCSearchResults from './HOCSearchResults';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import SW from './Search.swiss';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onChange', 'onScroll');
  }
  renderSearchField() {
    const { searchString } = this.props;

    return (
      <SW.SearchField>
        <SW.Input
          type="text"
          autoFocus
          placeholder="Search for plans, goals and posts"
          value={searchString}
          onChange={this.onChange}
        />
      </SW.SearchField>
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
