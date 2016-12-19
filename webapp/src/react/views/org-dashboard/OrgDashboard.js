import React, { Component, PropTypes } from 'react';

class OrgDashboard extends Component {
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

export default OrgDashboard;

const { string } = PropTypes;

OrgDashboard.propTypes = {
  removeThis: string.isRequired,
};
