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
import CompatibleInvite from './CompatibleInvite';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleInvite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <CompatibleCard>
        <CompatibleInvite />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleInvite.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCCompatibleInvite);
