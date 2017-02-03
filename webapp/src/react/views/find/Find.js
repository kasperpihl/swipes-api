import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import { list } from 'react-immutable-proptypes';
import Loader from 'components/loaders/Loader';
import FindItem from './FindItem';

class Find extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
  }

  renderSubTitle() {
    const { results, searchQuery, searching } = this.props;
    let string = '';
    if (results && !searching && searchQuery && searchQuery.length) {
      string = `${results.size} results found for '${searchQuery}'`;
    }
    return (
      <div className="find__subtitle">{string}</div>
    );
  }
  renderHeader() {
    return (
      <div className="find__header">
        {this.renderInput()}
        {this.renderSubTitle()}
      </div>
    );
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
      <div className="find__results">
        {renderedResults}
      </div>
    );
  }
  render() {
    return (
      <div className="find">
        {this.renderResults()}
        {this.renderLoader()}
      </div>
    );
  }
}

export default Find;

const { object, string, bool } = PropTypes;
Find.propTypes = {
  delegate: object,
  actionLabel: string,
  results: list,
  searchQuery: string,
  searching: bool,
};
