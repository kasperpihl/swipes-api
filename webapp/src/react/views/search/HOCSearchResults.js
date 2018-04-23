import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import * as cs from 'swipes-core-js/selectors';
import { navForContext } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Icon from 'Icon';
import SearchResult from './SearchResult';

class HOCSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'willOpenResult');
  }
  onClick(id, res) {
    const { openSecondary } = this.props;
    this.willOpenResult(id);
    openSecondary(navForContext(id));
  }
  renderEmptyState(type) {
    let emptyIcon = 'ESSearch';
    let emptyTitle = (
      <div className="search-results__empty-title">LOOKING FOR SOMETHING?</div>
    );
    let emptyText = (
      <div className="search-results__empty-text">
        Search for plans, goals or
        <br />
        discussions by keywords.
      </div>
    );

    if (type === 'noresults') {
      emptyIcon = 'ESNoResults';
      emptyTitle = (
        <div className="search-results__empty-title">Oops! Nothing found.</div>
      );
      emptyText = (
        <div className="search-results__empty-text">
          We even searched our pockets but no results.
        </div>
      );
    }

    return (
      <div className="search-results__empty-state">
        <div className="search-results__empty-illustration">
          <Icon icon={emptyIcon} className="search-results__empty-svg" />
        </div>
        {emptyTitle}
        {emptyText}
      </div>
    )
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
      return this.renderEmptyState('nosearch')
    }

    if (results && !results.length) {
      return this.renderEmptyState('noresults')
    }
  }
  render() {
    const { results } = this.props;
    let className = 'search-results';

    if (!results || results && !results.length) {
      className += ' search-results--empty-state'
    }

    return (
      <div className={className}>
        {this.renderResults()}
      </div>
    );
  }
}


export default navWrapper(connect((state, props) => ({
  results: cs.global.search(state, props),
}))(HOCSearchResults));
