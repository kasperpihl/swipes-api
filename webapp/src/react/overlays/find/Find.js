import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import { list } from 'react-immutable-proptypes';
import Loader from 'components/swipes-ui/Loader';
import FindItem from './FindItem';
import HOCBrowse from './browse/HOCBrowse';

import './styles/find.scss';

class Find extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this._searchInput.focus();
    }, 0);
  }
  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.callDelegate('findSearch', this._searchInput.value);
    }
  }
  renderInput() {
    return (
      <input
        onKeyUp={this.onKeyUp}
        type="text"
        ref={(c) => { this._searchInput = c; }}
        className="find__input"
        placeholder="Search across Dropbox, Asana, Slack..."
      />
    );
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
        data={r.getIn(['shareData', 'meta'])}
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
        {this.renderHeader()}
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
