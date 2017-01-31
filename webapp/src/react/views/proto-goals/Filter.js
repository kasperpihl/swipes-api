import React, { Component, PropTypes } from 'react';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="goals-filter">
        <div className="goals-filter__section">
          <div className="goals-filter__filter">
            Belongs to Milestone
            <div className="filter-dropdown" />
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;

const { string } = PropTypes;

Filter.propTypes = {
  removeThis: string.isRequired,
};
