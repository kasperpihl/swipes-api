import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as a from '../actions';
import { setupCachedCallback } from '../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../utils/globalStyles';
import FeedbackButton from '../components/feedback-button/FeedbackButton';

class ActionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.onButtonClick = setupCachedCallback(this.onButtonClick, this);
  }
  componentWillReceiveProps(nextProps) {
    const { modalState } = this.state;

    if (nextProps.modal.size > 1 && !modalState) {
      this.setState({ modalState: true });
    } else if (nextProps.modal.size < 1 && modalState) {
      this.setState({ modalState: false });
    }
  }
  onButtonClick(i, props, e) {
    const { modal } = this.props;

    if (modal.get('onClick')) {
      modal.get('onClick')(i, props, e);
    }
  }
  closeModal() {
    const { showModal } = this.props;

    showModal();
  }
  renderButtons() {
    const { modal } = this.props;

    if (modal && modal.get('actions')) {
      const buttons = modal.get('actions').map((action, i) => (
        <FeedbackButton onPress={this.onButtonClick(i, action.props)} key={`button-${i}`}>
          <View style={styles.button}>
            <Text>{action.title}</Text>
            {i < modal.get('actions').length - 1 ? <View style={styles.seperator} /> : undefined}
          </View>
        </FeedbackButton>
      ));

      return (
        <View style={styles.modalBox}>
          {buttons}
        </View>
      );
    }

    return undefined;
  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.modalState}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.closeModal}>
            <View style={styles.tappableOverlay} />
          </TouchableWithoutFeedback>
          {this.renderButtons()}
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
    backgroundColor: 'rgba(0, 12, 47, 0.8)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tappableOverlay: {
    width: viewSize.width,
    height: viewSize.height,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  modalBox: {
    width: viewSize.width * 0.8,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    borderRadius: 6,
    elevation: 5,
  },
  button: {
    width: viewSize.width * 0.8,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seperator: {
    width: viewSize.width * 0.8,
    height: 1,
    backgroundColor: colors.deepBlue5,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});

function mapStateToProps(state) {
  return {
    modal: state.getIn(['modals', 'modal']),
  };
}

export default connect(mapStateToProps, {
  showModal: a.modals.showModal,
})(ActionModal);
