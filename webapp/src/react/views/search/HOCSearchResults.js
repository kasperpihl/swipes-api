import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

class HOCSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div />
    );
  }
}
// const { string } = PropTypes;

HOCSearchResults.propTypes = {};

function mapStateToProps(state, props) {
  return {
    results: cs.global.search(state, props),
  };
}

export default connect(mapStateToProps, {
})(HOCSearchResults);
