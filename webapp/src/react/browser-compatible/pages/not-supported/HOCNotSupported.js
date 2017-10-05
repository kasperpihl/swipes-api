import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import NotSupported from './NotSupported';

class HOCNotSupported extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onLeaveOrg() {
    
  }
  render() {
    return (
      <CompatibleCard>
        <NotSupported delegate={this} />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCNotSupported.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCNotSupported);
