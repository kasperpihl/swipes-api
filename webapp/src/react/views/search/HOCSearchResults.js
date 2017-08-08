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
  onClick(id, res) {
    const { openSecondary } = this.props;
    openSecondary(navForContext(id));
  }
  renderResults() {
    const { results, limit } = this.props;
    if(results && results.length) {
      return results.map((res, i) => (i < limit) ? (
        <SearchResult
          key={res.item.id}
          delegate={this}
          result={res}
        />
      ) : null);
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
