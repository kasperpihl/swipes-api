import React, { Component, PropTypes } from 'react';
import ResultItem from './ResultItem';

class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="tab-menu__list">
        <ResultItem />
      </div>
    );
  }
}

export default ResultList;

const { string } = PropTypes;

ResultList.propTypes = {
  // removeThis: string.isRequired,
};
