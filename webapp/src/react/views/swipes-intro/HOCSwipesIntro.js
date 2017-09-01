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
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SwipesIntro from './SwipesIntro';

class HOCSwipesIntro extends PureComponent {
  static minWidth() {
    return 720;
  }
  static maxWidth() {
    return 720;
  }
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <SwipesIntro />
    );
  }
}
// const { string } = PropTypes;

HOCSwipesIntro.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(navWrapper(HOCSwipesIntro));
