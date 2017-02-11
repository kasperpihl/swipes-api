import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import { list } from 'react-immutable-proptypes';
import Loader from 'components/loaders/Loader';
import FindItem from './FindItem';
import './styles/search-results.scss';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
  }
  renderLoader() {
    const {
      searching,
    } = this.props;

    if (!searching) {
      return undefined;
    }

    return (
      <Loader text="Searching..." center />
    );
  }
  renderResults() {
    const {
      results,
      actionLabel,
    } = this.props;
    if (!results || !results.size) {
      return undefined;
    }

    const renderedResults = results.map((r, i) => (
      <FindItem
        key={i}
        index={i}
        actionLabel={actionLabel}
        data={r}
        delegate={this.props.delegate}
      />
    ));

    return (
      <div className="search__result">
        {renderedResults}
      </div>
    );
  }
  render() {
    return (
      <div className="search">
        {this.renderResults()}
        {this.renderLoader()}
      </div>
    );
  }
}

export default SearchResults;

const { object, string, bool } = PropTypes;
SearchResults.propTypes = {
  delegate: object,
  actionLabel: string,
  results: list,
  searchQuery: string,
  searching: bool,
};
