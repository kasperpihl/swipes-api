import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AccountList from './AccountList';

class HOCAccountList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <AccountList />
    );
  }
}
// const { string } = PropTypes;

HOCAccountList.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCAccountList);
