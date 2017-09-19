import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * as cs from 'swipes-core-js/selectors';
import Update from './Update';

class HOCUpdate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <Update />
    );
  }
}
// const { string } = PropTypes;

HOCUpdate.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCUpdate);
