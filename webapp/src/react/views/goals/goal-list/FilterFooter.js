import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindAll, setupDelegate } from 'swipes-core-js/classes/utils';
import './styles/filter-footer.scss';

class FilterFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['toggleCompleted']);
    setupDelegate(this);
    this.editFilter = this.callDelegate.bind(null, 'onEditFilter');
  }
  toggleCompleted() {
  }
  render() {
    const { status, disableEdit } = this.props;
    // let toggleClass = 'filter-footer__button filter-footer__button--toggle';
    let editClass = 'filter-footer__button filter-footer__button--edit';

    /* if (showCompleted) {
      toggleClass += ' filter-footer__button--active';
    }*/

    if (disableEdit) {
      editClass += ' filter-footer__button--hide';
    }

    return (
      <div className="filter-footer">
        <div className="filter-footer__section">
          <div className="filter-footer__status">{status}</div>
          <button className={editClass} onClick={this.editFilter}>Edit filter</button>
        </div>
        {/* <div className="filter-footer__section">
          <button className={toggleClass} onClick={this.toggleCompleted} />
          <div className="filter-footer__status">Include completed goals</div>
        </div>*/}
      </div>
    );
  }
}

export default FilterFooter;

const { string, object, bool } = PropTypes;

FilterFooter.propTypes = {
  status: string,
  delegate: object,
  disableEdit: bool,
};
