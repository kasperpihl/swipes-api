import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import './styles/filter-footer.scss';

class FilterFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['editFilter', 'toggleCompleted']);
  }
  editFilter() {

  }
  toggleCompleted() {

  }
  render() {
    const { status, showCompleted, disableEdit } = this.props;
    let toggleClass = 'filter-footer__button filter-footer__button--toggle';
    let editClass = 'filter-footer__button filter-footer__button--edit';

    if (showCompleted) {
      toggleClass += ' filter-footer__button--active';
    }

    if (disableEdit) {
      editClass += ' filter-footer__button--hide';
    }

    return (
      <div className="filter-footer">
        <div className="filter-footer__section">
          <div className="filter-footer__status">{status}</div>
          <button className={editClass} onClick={this.editFilter}>Edit filter</button>
        </div>
        <div className="filter-footer__section">
          <button className={toggleClass} onClick={this.toggleCompleted} />
          <div className="filter-footer__status">Include completed goals</div>
        </div>
      </div>
    );
  }
}

export default FilterFooter;

const { string, object, bool } = PropTypes;

FilterFooter.propTypes = {
  status: string,
  delegate: object,
  showCompleted: bool,
  disableEdit: bool,
};
