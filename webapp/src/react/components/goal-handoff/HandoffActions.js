import React, { Component, PropTypes } from 'react';

class HandoffActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="handoff-actions" />
    );
  }
}

export default HandoffActions;

const { string } = PropTypes;

HandoffActions.propTypes = {
  removeThis: string.isRequired,
};
