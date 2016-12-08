import React, { Component, PropTypes } from 'react';
import FindItem from './FindItem';

import './styles/find.scss';

class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderInput() {
    return (
      <input
        type="text"
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
  renderContent() {
    return (
      <div className="find__results">
        <FindItem />
      </div>
    );
  }
  render() {
    return (
      <div className="find">
        {this.renderHeader()}
        {this.renderContent()}
      </div>
    );
  }
}

export default Find;
