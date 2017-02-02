import React, { Component, PropTypes } from 'react';

import './styles/filter-footer.scss';

class FilterFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const showCompleted = false;
    let toggleClass = 'filter-footer__button filter-footer__button--toggle';

    if (showCompleted) {
      toggleClass += ' filter-footer__button--active';
    }

    return (
      <div className="filter-footer">
        <div className="filter-footer__section">
          <div className="filter-footer__status">Showing 43 goals related to milestone The Connected Workspace</div>
          <button className="filter-footer__button filter-footer__button--edit">Edit filter</button>
        </div>
        <div className="filter-footer__section">
          <button className={toggleClass} />
          <div className="filter-footer__status">Include completed goals</div>
        </div>
      </div>
    );
  }
}

export default FilterFooter;
