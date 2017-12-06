import React, { PureComponent } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { TouchableWithoutFeedback, View, StyleSheet ,StatusBar, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
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
    backgroundColor: gs.colors.deepBlue100,
    opacity: .9,
    position: 'absolute',
    left: 0, top: 0
  }
})

class HOCModal extends PureComponent {
  constructor(props) {
    super(props);


    bindAll(this, ['onClose']);
    // setupLoading(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
  }
  componenetWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillReceiveProps(nextProps) {
    const { modal } = this.props;
    const nextModal = nextProps.modal;
    if(modal && modal !== nextModal) {
      if(typeof modal.onDidClose === 'function') {
        modal.onDidClose();
      }
    }
  }
  onClose() {
    const { showModal } = this.props;
    showModal();
  }
  renderComponent() {
    const { modal } = this.props;
    if(!modal) {
      return null;
    }
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
    const { modal } = this.props;
    return (
      <View 
        pointerEvents={modal ? 'auto' : 'none'}
        style={{
        width: viewSize.width,
        height: viewSize.height,
        position: 'absolute',
        left: 0,
        top: 0,
      }}>
        {this.renderComponent()}
        <KeyboardSpacer />
      </View>
    )
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
