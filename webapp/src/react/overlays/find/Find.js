import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import FindItem from './FindItem';

import './styles/find.scss';

class Find extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate, this);
    this.onKeyUp = this.onKeyUp.bind(this);
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
    return (
      <div className="find__subtitle">339 Results</div>
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
  renderResults() {
    const { results } = this.props;
    if (!results || !results.size) {
      return undefined;
    }
    return (
      <div className="find__results">
        {results.map((r, i) => <FindItem key={i} data={r.getIn(['shareData', 'meta'])} />)}
      </div>
    );
  }
  render() {
    return (
      <div className="find">
        {this.renderHeader()}
        {this.renderResults()}
      </div>
    );
  }
}

export default Find;
