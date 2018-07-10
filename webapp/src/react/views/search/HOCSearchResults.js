import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import * as cs from 'swipes-core-js/selectors';
import { navForContext } from 'swipes-core-js/classes/utils';
import EmptyState from '../../components/empty-state/EmptyState';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Icon from 'Icon';
import SearchResult from './SearchResult';
import SW from './SearchResult.swiss';

@navWrapper
@connect((state, props) => ({
  results: cs.global.search(state, props),
}))
export default class HOCSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'willOpenResult');
  }
  onClick(id, res) {
    const { openSecondary } = this.props;
    this.willOpenResult(id);
    openSecondary(navForContext(id));
  }
  renderResults() {
    const { results, limit } = this.props;

    if (results && results.length) {
      return results.map((res, i) => (i < limit) ? (
        <SearchResult
          key={res.item.id}
          delegate={this}
          result={res}
        />
      ) : null);
    }

    if (!results) {
      return (
        <EmptyState
          icon = 'ESSearch'
          title="Looking for something?"
          description={`Search for plans, goals or \n discussions by keywords.`}
          fill
          searchResult
        />
      )
    }

    if (results && !results.length) {
      return (
        <EmptyState
          icon = 'ESNoResults'
          title="Oops! Nothing found."
          description={`We even searched our pockets but no results.`}
          fill
          searchResult
        />
      )
    }
  }
  render() {
    const { results } = this.props;
    let emptyState = undefined;

    if (!results || results && !results.length) {
      emptyState = true
    }

    return (
      <SW.SearchResult emptyState={emptyState}>
        {this.renderResults()}
      </SW.SearchResult>
    );
  }
}

