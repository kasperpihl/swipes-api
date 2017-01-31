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
      <div className="className" />
    );
  }
}

export default Filter;

const { string } = PropTypes;

Filter.propTypes = {
  removeThis: string.isRequired,
};
