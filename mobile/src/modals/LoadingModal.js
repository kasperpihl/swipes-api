import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import * as a from '../actions';
import { setupCachedCallback } from '../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../utils/globalStyles';

class LoadingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: false,
    };

    this.closeModal = this.closeModal.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { loadingState } = this.state;

    if (nextProps.loading && !loadingState) {
      this.setState({ loadingState: true });
    } else if (!nextProps.loading && loadingState) {
      this.setState({ loadingState: false });
    }
  }
  closeModal() {
    const { showLoader } = this.props;

    showLoader();
  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.loadingState}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modal}>
          <ActivityIndicator color={colors.blue100} size="large" />
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  modal: {
    width: viewSize.width,
    height: viewSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

function mapStateToProps(state) {
  return {
    loading: state.getIn(['loading', 'loading']),
  };
}

export default connect(mapStateToProps, {
  showLoader: a.modals.showLoader,
})(LoadingModal);
