import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';

import './styles/filter.scss';
// now use events as onClick:
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
  }
  componentDidMount() {
  }
  onClick(id, obj, e) {
    const { onClick } = this.props;
    if (onClick) {
      onClick(id, obj, e);
    }
  }
  renderFilters() {
    const { filter } = this.props;
    return filter.map((f) => {
      if (typeof f === 'string') {
        return f;
      }

      return (
        <button
          onClick={this.onClickCached(f.id, f)}
          className="sw-filter__selector"
          key={f.id}
        >
          {f.string}
        </button>
      );
    });
  }
  render() {
    return (
      <div className="sw-filter">
        {this.renderFilters()}
      </div>
    );
  }
}

export default Filter;

const { string, shape, arrayOf, oneOfType, func } = PropTypes;

Filter.propTypes = {
  filter: arrayOf(oneOfType([
    string,
    shape({
      id: string.isRequired,
      string: string.isRequired,
    }),
  ])).isRequired,
  onClick: func,
};
