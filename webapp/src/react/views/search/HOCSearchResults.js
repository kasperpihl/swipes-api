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
import Icon from 'Icon';
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
    let emptyIcon = 'ESSearch';
    let emptyTitle = (<div className="search-results__empty-title">LOOKING FOR SOMETHING?</div>)
    let emptyText = (<div className="search-results__empty-text">Search for milestones, goals or <br /> discussions by keywords.</div>)

    if (type === 'noresults') {
      emptyIcon = 'ESNoResults'
      emptyTitle = (<div className="search-results__empty-title">Oops! Nothing found.</div>)
      emptyText = (<div className="search-results__empty-text">We even searched our pockets but no results.</div>)
    }

    return (
      <div className="search-results__empty-state">
        <Icon icon={emptyIcon} className="search-results__empty-svg" />
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
