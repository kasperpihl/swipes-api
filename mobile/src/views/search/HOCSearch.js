import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
// import Search from './Search';

class HOCSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <View><Text>this is fucking search</Text></View>
    );
  }
}
// const { string } = PropTypes;

HOCSearch.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCSearch);