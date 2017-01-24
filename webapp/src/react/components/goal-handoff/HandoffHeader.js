import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

class HandoffHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderFrom() {

  }
  renderTo() {

  }
  render() {
    return (
      <div className="handoff-header">
        {this.renderFrom()}
        {this.renderTo()}
      </div>
    );
  }
}

export default HandoffHeader;

const { func } = PropTypes;

HandoffHeader.propTypes = {
  from: map,
  to: map,
  onChangeClick: func,
};
