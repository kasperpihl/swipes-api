import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';

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

      return <div onClick={this.onClickCached(f.id, f)} className="slsl">{f.string}</div>;
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

const { string, shape, arrayOf, oneOf, bool, func } = PropTypes;

Filter.propTypes = {
  filter: arrayOf(oneOf([
    string,
    shape({
      id: string.isRequired,
      string: string.isRequired,
    }),
  ])).isRequired,
  onClick: func,
};
