import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import * as gs from 'styles';
import { viewSize, statusbarHeight } from 'globalStyles';

const MODAL_HEIGHT = viewSize.height;

const styles = StyleSheet.create({
  modal: {
    ...gs.mixins.size(viewSize.width, MODAL_HEIGHT),
    ...gs.mixins.flex('column', 'center', 'center'),
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  loadingLabel: {
    ...gs.mixins.padding(12, 0),
    ...gs.mixins.font(15, 'white')
  }
});

class HOCLoading extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  renderLabel() {
    const { loading } = this.props;
    if(typeof loading !== 'string') {
      return null;
    }
    return (
      <Text style={styles.loadingLabel}>{loading}</Text>
    )
  }
  render() {
    const { loading } = this.props;
    if(!loading) {
      return null;
    }

    return (
      <View style={styles.modal}>
        <ActivityIndicator color='white' size="large" />
        {this.renderLabel()}
      </View>
    );
  }
}
// const { string } = PropTypes;

HOCLoading.propTypes = {};

const mapStateToProps = (state) => ({
  loading: state.main.get('loading'),
});

export default connect(mapStateToProps, {
})(HOCLoading);
