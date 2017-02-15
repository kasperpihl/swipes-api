import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

class HOCTeam extends PureComponent {
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
// const { string } = PropTypes;

HOCTeam.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCTeam);
