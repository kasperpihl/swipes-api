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
import CompatibleDownload from './CompatibleDownload';

class HOCCompatibleDownload extends PureComponent {
  constructor(props) {
    super(props);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <CompatibleDownload 
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleDownload.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCCompatibleDownload);