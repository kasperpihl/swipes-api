import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { fromJS } from 'immutable';
import * as a from '../../actions';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../utils/globalStyles';
import RippleButton from '../../components/ripple-button/RippleButton';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import Icon from '../../components/icons/Icon';
import ActionModalList from './ActionModalList';

class ActionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalState: false,

    };

    this.closeModal = this.closeModal.bind(this);
    this.onMultipleClick = this.onMultipleClick.bind(this);
    // this.onButtonClick = setupCachedCallback(this.onButtonClick, this);
  }
  componentWillReceiveProps(nextProps) {
    const { modalState } = this.state;

    if (nextProps.modal.size > 1 && !modalState) {
      this.setState({ modalState: true });

      if (nextProps.modal.get('multiple')) {
        this.setState({ selectedItems: fromJS([]) });
      }
    } else if (nextProps.modal.size < 1 && modalState) {
      this.setState({ modalState: false });
    }
  }
  onItemPress(item, e) {
    const { modal } = this.props;

    if (modal.get('multiple')) {
      let { selectedItems } = this.state;

      if (selectedItems.includes(item.index)) {
        selectedItems = selectedItems.delete(selectedItems.indexOf(item.index));
      } else {
        selectedItems = selectedItems.push(item.index);
      }

      this.setState({ selectedItems });
    } else {
      modal.get('onClick')(item, e);
    }
  }
  onMultipleClick() {
    const { selectedItems } = this.state;
    const { modal } = this.props;

    modal.get('onClick')(selectedItems);
  }
  closeModal() {
    const { showModal } = this.props;

    showModal();
  }
  renderTitle() {
    const { modal } = this.props;

    if (modal && modal.get('title')) {
      return (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {modal.get('title')}
          </Text>
        </View>
      );
    }

    return undefined;
  }
  renderList() {
    const { selectedItems } = this.state;
    const { modal } = this.props;

    if (modal && modal.get('items')) {
      return <ActionModalList listItems={modal.get('items')} selectedItems={selectedItems} multiple={modal.get('multiple')} delegate={this} />;
    }

    return undefined;
  }
  renderAction() {
    const { modal } = this.props;

    if (modal && modal.get('multiple')) {
      return (
        <RippleButton
          rippleColor={colors.blue100}
          rippleOpacity={0.8}
          style={styles.ctaButton}
          onPress={this.onMultipleClick}
        >
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>{modal.get('multiple')}</Text>
          </View>
        </RippleButton>
      );
    }

    return undefined;
  }
  render() {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.state.modalState}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.closeModal}>
            <View style={styles.tappableOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            {this.renderTitle()}
            {this.renderList()}
            {this.renderAction()}
          </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    width: 275,
    height: viewSize.height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    elevation: 5,
  },
  titleWrapper: {
    width: 275,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    color: colors.deepBlue100,
  },
  button: {
    width: 275,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  actionTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.deepBlue80,
    paddingLeft: 15,
  },
  selectionWrapper: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: colors.deepBlue20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    width: 275,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cta: {
    width: 275,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    borderTopWidth: 2,
    borderTopColor: colors.blue100,
  },
  ctaTitle: {
    fontSize: 18,
    color: colors.blue100,
  },
});

function mapStateToProps(state) {
  return {
    modal: state.getIn(['modals', 'modal']),
  };
}

export default connect(mapStateToProps, {
  showModal: a.modals.show,
})(ActionModal);
