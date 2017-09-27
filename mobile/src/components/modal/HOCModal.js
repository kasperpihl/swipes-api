import React, { PureComponent } from 'react';

import { TouchableWithoutFeedback, View, StyleSheet ,StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Modal from 'react-native-modalbox';
import { viewSize, statusbarHeight } from 'globalStyles';
import * as gs from 'styles';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  container: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
  },
  backDrop: {
    ...gs.mixins.size(viewSize.width, viewSize.height),
    position: 'absolute',
    left: 0, top: 0
  }
})

class HOCModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      blockNew: false,
    };

    bindAll(this, ['onClose', 'onDidClose', 'onClosingState']);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { modal } = this.props;
    const nextModal = nextProps.modal;
    if(modal && modal !== nextModal) {
      if(typeof modal.onDidClose === 'function') {
        this._onDidCloseHandler = modal.onDidClose;
      }
      this.setState({ blockNew: true });
    }
  }
  onClosingState(closing) {
    this.closingState = closing;
  }
  onClose() {
    const { showModal } = this.props;
    showModal();
  }
  onDidClose() {
    if(this.closingState) {
      this.closingState = false;
      this.onClose();
    }
    if(this._onDidCloseHandler) {
      this._onDidCloseHandler();
      this._onDidCloseHandler = null;
    }
    this.setState({ blockNew: false });

  }
  renderComponent(isOpen) {
    if(!isOpen) {
      return null;
    }

    const { modal } = this.props;

    let Comp;
    if(modal && modal.component) {
      Comp = modal.component;
    }
    const compProps = (modal && modal.props);

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.onClose}>
          <View style={styles.backDrop}>
          </View>
        </TouchableWithoutFeedback>
        <Comp {...compProps} closeModal={this.onClose} />
      </View>
    )
  }
  render() {
    const { modal } = this.props;
    const { blockNew } = this.state;
    const isOpen = !blockNew && !!modal;
    
    const modalProps = (!blockNew && modal && modal.modalProps) || {};

    return (
      <Modal
        isOpen={isOpen}
        style={styles.modal}
        onClosed={this.onDidClose}
        onClosingState={this.onClosingState}
        {...modalProps}
      >
        {this.renderComponent(isOpen)}
      </Modal>
    );
  }
}
// const { string } = PropTypes;

HOCModal.propTypes = {};

const mapStateToProps = (state) => ({
  modal: state.getIn(['main', 'modal']),
});

export default connect(mapStateToProps, {
  showModal: a.main.modal,
})(HOCModal);
