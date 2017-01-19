import React, { Component, PropTypes } from 'react';

class ResultList extends Component {
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

export default ResultList;

const { string } = PropTypes;

ResultList.propTypes = {
  removeThis: string.isRequired,
};
