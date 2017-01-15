import React, { Component, PropTypes } from 'react';

class ServiceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="service-selector" />
    );
  }
}

export default ServiceSelector;

const { string } = PropTypes;

ServiceSelector.propTypes = {
  removeThis: string.isRequired,
};
