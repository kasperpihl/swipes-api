import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';

class DefaultRow extends PureComponent {
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

export default DefaultRow;

// const { string } = PropTypes;

DefaultRow.propTypes = {};
