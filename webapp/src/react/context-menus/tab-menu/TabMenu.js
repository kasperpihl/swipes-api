import React, { Component, PropTypes } from 'react';

class TabMenu extends Component {
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

export default TabMenu;

const { string } = PropTypes;

TabMenu.propTypes = {
  removeThis: string.isRequired,
};
