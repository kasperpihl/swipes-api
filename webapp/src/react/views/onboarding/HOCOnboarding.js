import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Onboarding from './Onboarding';

class HOCOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <Onboarding />
    );
  }
}
// const { string } = PropTypes;

HOCOnboarding.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCOnboarding);
