import React, { PureComponent } from 'react';

import { TouchableWithoutFeedback, View, StyleSheet ,StatusBar } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Modal from 'react-native-modalbox';
import { viewSize } from 'globalStyles';
import * as gs from 'styles';

const styles = StyleSheet.create({
  backDrop: {
    ...gs.mixins.size(viewSize.width, viewSize.height),
    position: 'absolute',
    left: 0, top: 0
  }
})

class HOCModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onClose = this.onClose.bind(this);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onClose() {
    const { showModal } = this.props;
    showModal();
  }
  onDidClose() {
    console.log('did close yir');
  }
  render() {
    const { modal } = this.props;
    const isOpen = !!modal;
    let Comp;
    const modalStyles = {
      backgroundColor: 'transparent',
    };
    if(modal && modal.component) {
      Comp = modal.component;
    }
    const compProps = (modal && modal.props);
    const modalProps = (modal && modal.modalProps);

    return (
      <Modal 
        isOpen={isOpen}
        onClosed={this.onClose}
        style={modalStyles}
        coverScreen={true}
        {...modalProps}
      >
        {Comp ? (
          <View style={{ flex: 1}}>
            <TouchableWithoutFeedback onPress={this.onClose}>
              <View style={styles.backDrop}>
              </View>
            </TouchableWithoutFeedback>
            <Comp {...compProps} closeModal={this.onClose} />
          </View>
        ) : null}
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
