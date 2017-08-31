import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
import { navForContext } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SearchResult from './SearchResult';

class HOCSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onClick(id, res) {
    const { openSecondary } = this.props;

    openSecondary(navForContext(id));
  }
  renderEmptyState(type) {
    let emptyText = type === 'nosearch' ? 'Something got lost? Look up a keyword and we will help you find it' : 'Ups! Nothing found. We even searched our pockets, but no results.'

    return (
      <div className="search-results__empty-state">
        <div className="search-results__empty-text">{emptyText}</div>
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
    return (
      <div className="search-results">
        {this.renderResults()}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCSearchResults.propTypes = {};

function mapStateToProps(state, props) {
  return {
    results: cs.global.search(state, props),
  };
}

export default navWrapper(connect(mapStateToProps, {
})(HOCSearchResults));
